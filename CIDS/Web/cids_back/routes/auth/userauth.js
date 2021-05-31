let express = require('express');
const passport = require('passport');
let User = require("../../models/user");
let Keyword = require("../../models/keyword");
let router = express.Router();
require('dotenv').config();

let jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { isLogged, checkPermissions } = require('./middleware');
const e = require('express');
const { verifyToken } = require('./config');

var AWS = require('aws-sdk');
let awskey = require("../../config");
let s3_url = "https://s3.ap-northeast-2.amazonaws.com/cidsprofileimg/";


/* 회원가입 */
router.post('/register', async(req, res)=>{

    const user =  new User({
        login_id: req.body.loginId,
        email: req.body.email,
        last_name: req.body.lastname,
        first_name: req.body.firstname,
        user_type: "paid_user"
    })

    if(req.body.telphone){
        user.telephone = req.body.telphone
    }

    //ID 체크
    const idExist = await User.findOne({login_id: req.body.loginId})
    if(idExist){
        res.json({"message":'사용할 수 없는 ID입니다.', 'dupIdCheck': true})
        return;
    }
    else{
        if(req.body.loginId.length==0) {
            res.json({"message": '사용할 수 없는 ID입니다.', 'dupIdCheck': true})
            return;
        }

        
        else{
            //Email 체크
            const emailExist = await User.findOne({email: req.body.email})
            if(emailExist){
                res.json({"message":'사용할 수 없는 email입니다.', 'dupEmailCheck': true})
                return;
            }
            else{
                if(req.body.email.length==0) {
                    res.json({"message": '사용할 수 없는 email입니다.', 'dupEmailCheck': true})
                    return;
                }
                //성공한 경우
                else{
                    await bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.passwd, salt, (err, hash) => {
                            if(err) throw err;
                            user.passwd = hash
                            user.save()
                            res.json({'message': '회원가입에 성공했습니다.'});
                        })
                
                    });
                }
              
            }

        }

    }
    


});


/* 로그인 여부 확인 */
router.get('/islog', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    res.json({'status':200});
})

/* admin인지 확인 */
router.get('/isadmin', isLogged, async (req, res, next)=>{
    await passport.authenticate('jwt', (authError, user, info)=>{

        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.json(info);
        }
        if(user.user_type=='admin'){
            return next();
        }

    })(req, res, next);
})


//로그인요청
router.post('/login', async (req,res, next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    await passport.authenticate('local', (authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.json(info);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            const token = jwt.sign(
                { login_id: req.body.login_id},
                process.env.COOKIE_SECRET
            );
            return res.status(200).json({
                'message' : "로그인에 성공했습니다.",
                'token' : token,
                'user_id' : user.login_id,
            });
        });
    })(req, res, next);
});

//회원정보 가져오기
router.get('/getInfo', passport.authenticate('jwt', {session:false}), (req,res,next)=>{
    res.json({user:{
        lastname: req.user.last_name,
        firstname: req.user.first_name,
        telephone: req.user.telephone,
        email: req.user.email,
        img_path: req.user.img_path,
        user_type : req.user.user_type,
        }});
})

//회원정보 업데이트
router.put('/update/:id', async (req,res)=>{
    try{
        //방어 코딩
        if(req.session.passport === undefined || req.params.id !== req.session.passport.user.login_id)
        {
            res.json({message: '권한이 없습니다.'});
            return;
        }

        const emailExist = await User.findOne({email: req.body.email})
        //이메일 존재 여부 확인
        if(emailExist){
            
            //이메일이 존재하는데, 변경하려는 사람의 ID와 다를때
            if(emailExist.login_id != req.session.passport.user.login_id){
                res.json({"message":'사용할 수 없는 이메일 주소입니다.'});
            }
            else {
                await User.findOneAndUpdate({login_id: req.params.id}, {
                    last_name: req.body.last_name,
                    first_name: req.body.first_name,
                    telephone: req.body.telephone,
                    email: req.body.email
                }).then(()=>{
                    res.json({'message': "유저 정보를 성공적으로 업데이트 했습니다."})
                });
            }
    
            
        } else {
            await User.findOneAndUpdate({login_id: req.params.id}, {
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                telephone: req.body.telephone,
                email: req.body.email
            }).then(()=>{
                res.json({'message': "유저 정보를 성공적으로 업데이트 했습니다."})
            });
        }
    } catch(err){
        console.log(err);
        res.json({"message" : err});
    }
   
 


})


/* 비밀번호 변경 */
router.put("/:id/changePw", isLogged, async(req, res)=>{

    try{

        //방어 코딩
        if(req.session.passport === undefined || req.params.id !== req.session.passport.user.login_id)
        {
            res.json({message: '권한이 없습니다.'});
            return;
        }
        else{
            await User.findOne({login_id: req.params.id}).then((user)=>{
                bcrypt.compare(req.body.currentPw, user.passwd)
                    .then(isMatch => {
                        if (isMatch) {
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(req.body.newPw, salt, (err, hash) => {
                                    if(err) throw err;
                                    user.passwd = hash
                                    user.save()
                                    res.json({'check':true, 'message': '비밀번호를 성공적으로 변경했습니다.'})
                                });
    
                            });
                            //return done(null, user);
                        } else {
                            res.json({'message': '비밀번호를 변경할 수 없습니다.'})
                            //return done(null, false, {message: '비밀번호를 다시 확인해주세요'}); //비밀번호 일치 x
                        }
                    });
            });
        }
    }
    catch(e){
        console.log(e)
        res.json({'message': '비밀번호를 변경할 수 없습니다.'})
    }
})

/* 회원 탈퇴 */

router.delete('/delete/:id', async(req, res)=>{
    try {
    
        //방어 코딩
        if(req.session.passport === undefined || req.params.id !== req.session.passport.user.login_id)
        {
            res.json({message: '권한이 없습니다.'});
            return;
        }
        else{
            req.logout();
            req.session.destroy(async (err) => {
                res.clearCookie('connect.sid');
                await User.findOneAndRemove({login_id:req.params.id});
                res.json({ message: true });
            });
        }

    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
})


/* 프로필 사진 업로드 */
router.post(`/:id/profile-upload`, async (req, res, next) =>{

    const file = req.files.file;
    //아마존 S3 설정

    //AWS 설정
    AWS.config.region = 'ap-northeast-2';
    AWS.config.update({
        accessKeyId: awskey.AWSAccessKeyId,
        secretAccessKey: awskey.AWSSecretKey
    });

    var s3_params = {
        Bucket: 'cidsprofileimg',
        Key: `${file.name}`,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Body: file.data
    };

    var s3_obj = new AWS.S3({ params: s3_params});
    s3_obj
        .upload()
        .on('httpUploadProgress', function(event){})
        .send((err,data) =>{

            User.findOneAndUpdate({login_id: req.params.id},{
                img_path: data.key
            })
                .then((user) =>{
                    res.json({message: true, img_path: data.key}); //파일 url 획득

                })
                .catch(err => {
                    console.log(err);
                    res.json({message: false});
                })

        });

});

/* 로그아웃 */
router.get('/logout',isLogged,async(req,res,next) => {

    await passport.authenticate('jwt', (authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.json(info);
        }
        //존재하는 token
        req.logout();
        req.session.destroy((err) => {
            res.clearCookie('connect.sid');
            // Don't redirect, just print text
            res.json({message : '로그아웃에 성공했습니다.'});
            });

    })(req, res, next);
        
});



//결제 user 권한 체크
router.get('/checkPermission', isLogged, async (req, res,next)=>{
    if( req.session.passport.user.user_type==='admin'|| req.session.passport.user.user_type==='paid_user'){
        res.status(200).send();
    }
    else res.json({'message': "결제가 필요합니다."})

})

//user 권한 체크
router.get('/checkAuth',isLogged,async(req,res,next)=>{


    // await passport.authenticate('jwt', (authError, user, info)=>{
    //     console.log("asdasd");

    //     if(authError){
    //         console.error(authError);
    //         return next(authError);
    //     }
    //     if(!user){

    //         req.logout();
    //         req.session.destroy((err) => {
    //             res.clearCookie('connect.sid');
    //             return res.json(info);
    //         });
    //     }


    //     console.log("user: ",user);
    //     return res.json({userAuth: user.user_type});


    // });

    return res.json({user_auth :req.session.passport.user.user_type });
       
});


module.exports = router;