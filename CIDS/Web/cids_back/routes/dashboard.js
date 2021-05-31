var createError = require('http-errors');
const express = require('express');
const CountDomain = require('../models/countDomain');
const Keyword = require('../models/keyword');
const User = require('../models/user');
const Result = require('../models/result');
const mdq = require('mongo-date-query');
let moment = require('moment');


const router = express.Router();


/* 도메인 리스트 top5*/
router.get('/domain',async (req,res)=>{
    try{
        let count_domain_list = await CountDomain.find().sort({hit: -1});
        let domain_list = []
        if(count_domain_list.length > 0){
            for(let i=0; i<5; i++){
                let index = i+1;
                domain_list.push({
                    rank: index,
                    domain: count_domain_list[i].url_domain
                });
            }
        }
        return res.json({domains : domain_list});
    } catch(err) {
        console.log(err);
        res.json({message : "에러발생, 관리자에게 문의하세요."});
    }

});

/*사용자 수 */
router.get('/userinfo', async(req, res, next)=>{

    const today_cnt = await User.countDocuments({
        created_date: mdq.today()
    });
    const total_cnt = await User.countDocuments();
    res.json({'total_cnt':total_cnt, 'today_cnt': today_cnt});
})


/*키워드 검색 수*/
router.get('/keywordinfo', async (req, res, next)=>{
    const cnt = await Keyword.countDocuments({
        created_date: mdq.today()
    });
    res.json({'keyword_count': cnt})
})

/* 모델 정확도 */
router.get('/accuracy', async(req, res, next)=>{

    let average = await Result.aggregate([
        { $match : { label:0 }},
        { $group: {  _id: '$label', average: { $avg: '$accuarcy' } } },
    ]).exec();


    if(average){
        average = Number.parseFloat(average[0].average).toFixed(2)
        res.json({'accuracy': average})
        return;
    }
    else {
        res.json({'accuracy': '-'})
        return;
    }
})



/*7일간 도메인 탐지*/
router.get('/domaininfo', async(req, res, next)=>{

    let counts = [];
    let dates = [];
    let cnt = 0;
    let dat = ""
    for(let i=5; i>=0; i--){
        dat = moment().add(-i-1,"days").format("M월 D일")
        cnt = await Result.countDocuments({
            created_date : mdq.beforePreviousDays(i),
            label:0
        })
        cnt = cnt - await Result.countDocuments({
            created_date : mdq.beforePreviousDays(i+1),
            label:0
        })
        dates.push(dat)
        counts.push(cnt)
    }
    cnt = await Result.countDocuments({
        created_date : mdq.today(),
        label: 0
    })
    dat = moment().format("M월 D일")
    dates.push(dat)
    counts.push(cnt)
    res.json({search_counts : counts, search_dates: dates})

})


module.exports = router;