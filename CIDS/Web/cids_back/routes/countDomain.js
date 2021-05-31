var createError = require('http-errors');
const express = require('express');
const CountDomain = require('../models/countDomain');
const keyword = require('../models/keyword');



const router = express.Router();


/* 찾아진 의심 도메인 리스트 가져오기, 검색도 반영 */
router.get('/:keyword',async (req,res)=>{
    try{
        if(req.params.keyword == 'all')
        {   
            let count_domain_list = await CountDomain.find({}).sort({hit: -1});
            return res.json({domains : count_domain_list});
        }
        else{
            let count_domain_list = await CountDomain.find({'url_domain':{$regex: req.params.keyword}}).sort({hit: -1});
            return res.json({domains : count_domain_list});
        }
    } catch(err) {
        console.log(err);
        res.json({message : "에러발생, 관리자에게 문의하세요."});
    }

});

module.exports = router;
