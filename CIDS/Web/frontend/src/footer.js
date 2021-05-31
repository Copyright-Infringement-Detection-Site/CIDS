import React, {Component} from 'react';
import {} from './css/footer.css';
import { NavLink } from "react-router-dom";

class Footer extends Component{

  render(){
  return(
  <div className="site-footer">
  <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About Us</h6>
            <p className="text-justify"> 
            We are looking for a site suspected of copyright infringement. 
            If you want to protect your content, Use our CIDS right now!</p> 
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul className="footer-links">
              <li style={{float:"none"}}><NavLink to="/" style={{borderStyle:"none", width:"53px", backgroundColor:"#FF", textAlign:"left"}}>Home</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/postNotice" style={{borderStyle:"none", width:"60px", textAlign:"left"}}>공지사항</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/postQna" style={{borderStyle:"none", width:"50px", textAlign:"left"}}>Q & A</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/ranking" style={{borderStyle:"none", width:"110px", textAlign:"left"}}>의심 도메인 순위</NavLink></li>
              <li style={{float:"none"}}><NavLink to="/service" style={{borderStyle:"none", width:"90px", textAlign:"left"}}>CIDS 서비스</NavLink></li>
            </ul>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Contact Us</h6>
            <ul className="footer-links">
              <li style={{float:"none"}}>Address :</li>
              <li style={{float:"none"}}>아주대학교 사이버보안학과</li>
              <li style={{float:"none"}}>Email :</li>
              <li style={{float:"none"}}>cidswork@gmail.com</li>
              <li style={{float:"none"}}>telPhone :</li>
              <li style={{float:"none"}}>010-3716-6508</li>
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; 2021 All Rights Reserved by CIDS.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
  }

}

export default Footer;