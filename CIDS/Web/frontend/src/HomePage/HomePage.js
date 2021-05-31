import React, { Component } from "react";
import { Image } from "react-bootstrap"; 
import {} from "../css/home.css";



class HomePage extends Component{

  render(){
    return(
    <div>     
      <Image src="./img/home/copyright.jpg" style={{width:"100%" ,height:"10%", borderBottom:"1px solid black"}}/>
      <div className="hero-text">
        <h1 className="mt-3 ml-5">저작권 침해 의심 탐지를 위한 사이트</h1>
        <h4 className="mt-4 ml-5">CIDS를 이용하여 저작권 침해 의심 사이트를 탐지하고, 저작권을 보호하세요.</h4>
      </div>
      <div className="text-center" style={{height: "50%"}}>
        <div id="homeText">
          <h1 className="font-bold mt-5 mb-2">Copyright Infringement Detection Site</h1>
          <h6 className="font-bold">아래 서비스를 이용해 보세요.</h6>
        </div>
        <div className="row mx-5" style={{marginTop: "80px"}}>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}}  src="./img/home/dashboard.png"/>
              <h4 className="card-title">Dashboard</h4>
              <h5 className="card-subtitle mt-2 text-muted">CIDS의 이슈사항을 확인하세요.</h5>
            </div>
          </div>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}}  src="./img/category/RankingBoard.PNG"/>
              <h4 className="card-title">탐색된 의심 도메인 </h4>
              <h5 className="card-subtitle mt-2 text-muted">탐색된 의심 도메인을 확인하세요.</h5>
            </div>
          </div>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}} src="./img/home/search.jpg"/>
              <h4 className="card-title">키워드를 통한 탐지</h4>
              <h5 className="card-subtitle mt-2 text-muted">저작물 관련 키워드를 입력하세요.</h5>
            </div>
          </div>
          <div className="card home-card col-md-3" style={{width: "18rem"}}>
            <div className="card-body">
              <Image className="card-img fas mb-4" style={{width:"150px", height:"120px"}} src="./img/home/emailService.png"/>
              <h4 className="card-title">이메일 시스템</h4>
              <h5 className="card-subtitle mt-2 text-muted">의심 리스트를 이메일로 받으세요.</h5>
            </div>
          </div>
        </div>
        <br/>
      </div>
    </div>  
    );
  }

}

export default HomePage;