const Keyword = require('../models/keyword');
const User = require('../models/user');
const Result = require('../models/result');
var moment = require('moment');
const config = require('../config');

const nodemailer = require('nodemailer');
var parse = require('objects-to-csv');

async function emailAlram(keyword_id, user_email){
    try{
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: config.cide_email_id,
                pass: config.cids_email_pw
            }
        });
    
        //연결 여부 검증 
        transporter.verify(async (err,success) =>{
            try {
                if(err) {
                    console.log("email 연결 실패");
                    return;
                }
                else {
                    console.log("Server is ready to take our messages");
        
                    const receiver_email = user_email;
                    const keyword = await Keyword.find({'_id':keyword_id});
                    
                    const request_time = new Date(moment(keyword.created_date).format('YYYY-MM-DD HH:mm:ss'));
                    const completion_time = new Date(moment(keyword.updated_date).format('YYYY-MM-DD HH:mm:ss'));
                    console.log(request_time)
                    const warning_list = await Result.find({'keyword_id': keyword_id, 'label':0},['url']).lean();
                    
                    const csv = await new parse(warning_list);
                    let csv_path = `../../data_dir/send_csv_list/${user_email}_${keyword_id}_${request_time}`;
                    
                    await csv.toDisk(csv_path);
                    
                    try {
                        let info = await transporter.sendMail({
                            from: `"CIDS Team" <${config.cide_email_id}>`, //보내는 사람
                            to: receiver_email, //받는 사람
                            subject: "CIDS 저작권 침해 의심 탐지의 결과입니다.", //제목
                            //내용
                            text: "저희 CIDS 서비스를 이용해주셔서 감사합니다.\n\n"
                                  +"고객님이 요청하신 Keyword 기반으로 저작권 침해 의심 사이트 리스트를 추출했습니다.\n\n"
                                  +"URL 리스트는 파일로 첨부합니다. 내용 확인 후, 한국저작권보호원(COPY112)에 신고해주세요.\n\n"
                                  +"만약 warninglist.csv가 비어있다면, 요청 키워드로 저작권 침해 의심 사이트가 탐지되지 않았습니다.\n\n"
                                  +"해당 키워드에 다시보기 또는 무료(보기)를 붙혀서 재시도 해보세요.\n\n"
                                  +"읽어주셔서 감사합니다. 😊\n\n"
                                  +"- CIDS TEAM 드림 -\n\n"
                                  +"COPY112 : https://www.copy112.or.kr/ \n\n"
                                  +`Request Time : ${request_time} \n`
                                  +`Completion Time : ${completion_time} \n`, 
            
                            html: "<p>저희 CIDS 서비스를 이용해주셔서 감사합니다.</p></br>"
                                  +"<p>고객님이 요청하신 Keyword 기반으로 저작권 침해 의심 사이트 리스트를 추출했습니다.</p></br>"
                                  +"<p>URL 리스트는 파일로 첨부합니다. 내용 확인 후, 한국저작권보호원(COPY112)에 신고해주세요.</p></br>"
                                  +"<p>만약 warninglist.csv가 비어있다면, 요청 키워드로 저작권 침해 의심 사이트가 탐지되지 않았습니다.</p></br>"
                                  +"<p>해당 키워드에 다시보기 또는 무료(보기)를 붙혀서 재시도 해보세요.</p></br>"
                                  +"<p>읽어주셔서 감사합니다. 😊</p></br>"
                                  +"<p>- CIDS TEAM 드림 -</p></br>"
                                  +"<b>COPY112 : <a>https://www.copy112.or.kr/</a></b><br/>"
                                  +`<p>Request Time : ${request_time}</p>`
                                  +`<p>Completion Time : ${completion_time}</p>`,
                            //첨부파일
                            attachments: [
                                {
                                    filename: "warning_list.csv",
                                    path: csv_path
                                },
                            ],
                        });
        
                        console.log('Message sent: %s',info.messageId);
                        return 'complete';
        
                    } catch(err) {
                        console.log(err);
                        return err;
                    }
       
                }
            }
            catch(err){
                console.log(err);
                return;
            }
            
    
        });
    }
    catch(err){
        console.log(err);
        return;
    }

}


module.exports = {
    emailAlram : emailAlram
};
