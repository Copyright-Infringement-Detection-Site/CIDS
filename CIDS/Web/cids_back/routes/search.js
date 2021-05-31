var createError = require('http-errors');
const express = require('express');
const Keyword = require('../models/keyword');
const Url = require('../models/url');
const { isLogged } = require('./auth/middleware');

const router = express.Router();
var ps = require('python-shell');
const { emailAlram } = require('./email');

let options = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: '',
    args: 0,
};


/**
 * keyword 요청 로직 
 */
router.post('/', isLogged, async (req, res)=>{
    try{
        const user_email = req.session.passport.user.email //passport로 가져옴

        const keyword = new Keyword({
            keyword: req.body.keyword,
            user_id: req.session.passport.user._id,
            status: 1
        });
    
        await keyword.save();
        let keyword_id = keyword._id;
        options.args = keyword_id;

        res.json({'message': req.body.keyword+"에 대한 탐지가 진행되고 있습니다. 탐지가 완료되면 이메일로 결과를 알려드립니다."});
    
        await ps.PythonShell.run('../../CIDS_Main.py', options, async (err, results)=>{
            if(err) console.log(err);
            else {
                if(results[0]==="True") {
                    const result = emailAlram(keyword_id, user_email);
                    /*if(result == 'complete'){
                        return
                        } else {
                        console.log("cannot")
                        }*/
                }
            }
        });
    } catch(err){
        console.log(err);
    }
    
});

/* search가능 여부 확인 */
router.get('/authCheck',isLogged,async(req,res)=>{
    try{
        const authCheck = await Keyword.find({'user_id':req.session.passport.user._id, 'status':1});
        if(authCheck.length == 0){
            res.status(200).send();
        } else {
            res.json({'message':"이미 탐지가 진행중입니다. 완료가 되면 다시 시도해주세요"});
        }

    } catch(err){
        console.log(err);
    }
    
});


module.exports = router;
