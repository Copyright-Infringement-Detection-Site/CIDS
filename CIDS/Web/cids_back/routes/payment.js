const User = require('../models/user'); // 유저 테이블 
const Payment = require('../models/payment'); //결제 해야할 정보 가진 테이블
const Order = require('../models/order'); // 주문 테이블
const express = require('express');

const router = express.Router();

router.post('/complete',async(req,res)=>{
    try {
        const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
          url: "https://api.iamport.kr/users/getToken",
          method: "post", // POST method
          headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
          data: {
            imp_key: "3241159575589945", // REST API키
            imp_secret: "PoWxYARnRjuZTruDY1sUZTvIuk9pRKGH9De7d6u5qZ4jrzWpAokAiPiNard1cUIlxXtL4YQuXVNpuKP5" // REST API Secret
          }
        });
        const { access_token } = getToken.data.response; // 인증 토큰
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
          url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
          method: "get", // GET method
          headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가


        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

      const payment = Payment.find({'name':'paid membership'}); // 결제 되어야 하는 금액
      // 결제 검증하기
      const amountToBePaid = payment.amount;
      const { amount, status } = paymentData;
      if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
        // await Order.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
        const order = new Order({
            user_id : req.session.passport.user._id,
            merchant_uid : merchant_uid,
            status : status

        });
        order.save();
        switch (status) {
          case "ready": // 가상계좌 발급
            // DB에 가상계좌 발급 정보 저장
            // const { vbank_num, vbank_date, vbank_name } = paymentData;
            // await Users.findByIdAndUpdate("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
            // // // 가상계좌 발급 안내 문자메시지 발송
            // SMS.json({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
            res.json({ status: "vbankIssued", message: "가상계좌 발급 성공" });
            break;
          case "paid": // 결제 완료
            res.json({ status: "success", message: "일반 결제 성공" });
            break;
        }
      } else { // 결제 금액 불일치. 위/변조 된 결제
        throw { status: "fail", message: "결제금액 미일치" };
      }
    } catch (e) {
      res.status(400).send(e);
    }
    
});

module.exports = router;