const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
let User = require("../models/user");
const bcrypt = require('bcryptjs');
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = passportJWT;

exports.config = (passport) =>{
    //user를 세션에 저장 
    passport.serializeUser((user, done)=>{
        done(null, user);
    });

    //서버로 들어오는 요청마다 세션 정보(selializeUser에서 저장됨)를 실제 DB의 데이터와 비교
    passport.deserializeUser((user, done) => {
        User.findOne({login_id:user.login_id}, (err,user)=>{
            if(err){
                console.log(err);
            }
            else{
                done(null, user);

            }
            

        });
    });
    

    passport.use('local',new LocalStrategy({
        usernameField: "login_id",
        passwordField: "passwd",
        session: true,
    }, (login_id, passwd, done)=>{
        User.findOne({ login_id:login_id },(err, user)=>{
            if(err) return done(err);
            if(!user) return done(null, false, { message: 'ID와 비밀번호를 다시 확인해주세요' }); //일치하는 아이디 x
            bcrypt.compare(passwd, user.passwd)
                .then(isMatch => {
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'ID와 비밀번호를 다시 확인해주세요'}); //비밀번호 일치 x
                    }
                });
        });
    }));

    passport.use('jwt',new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
        secretOrKey: process.env.COOKIE_SECRET,
    }, (payload, done) => {
        try{
            //console.log(payload)
            User.findOne({ login_id : payload.login_id },(err, user)=>{
                if(err) return done(err);
                if(!user) return done(null, false, { reason: '로그인 token이 만료되었습니다.'});
                return done(null, user); //user 존재
            });
        }catch (e) {
            console.log(e);
            return done(e);
        }
    }));
};