import React, {Component} from 'react';
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import LoginForm from "./User/LoginForm";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import cogoToast from 'cogo-toast';
axios.defaults.withCredentials = true;

class Header extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      loginState: false,
      loginFormShow: false,
    }
  }

  componentDidMount(){
    if ($.cookie("login_id")){
      this.setState({
        loginState: true
      
      });
    } else{
      this.setState({
        loginState: false      
      });
    }
  }

  logout = () => {
    axios.defaults.headers.common['x-access-token'] = $.cookie('token');
    axios
      .get("/api/user/logout",{
      })
      .then( (response) => {
        if(response.data.message){
          $.removeCookie("login_id");
          $.removeCookie("token");
          cogoToast.success("로그아웃에 성공 했습니다.");
          setTimeout(function() {
            window.location.href="/";
          }, 1000);
        }
      });
  };

  handleLoginFormShow = () =>{
    this.setState({
      loginFormShow: !this.state.loginFormShow
    });
    
  }

  render(){
    
    const categoryStyle = {
      color:"white",
      textDecoration: "none",
      padding: "8px" 
    }

    return(
    <> 
    <Navbar style={{backgroundColor: "#090707"}} expand="lg"  variant="dark">
      <Navbar.Brand href="/">
        <img
        alt=""
        src="/img/logo_mini2.png"
        width="30"
        height="30"
        className="d-inline-block align-top"
        />
        <Navbar.Brand style={{ marginLeft:"10px"}}>CIDS</Navbar.Brand>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" style={categoryStyle}>
          <NavLink to="/dashboard" style={categoryStyle}>대시보드 </NavLink>
          <NavLink to="/postNotice" style={categoryStyle} onClick={() => {window.location.href="/postNotice"}}>공지사항 </NavLink>
          <NavLink to="/postQna" style={categoryStyle} onClick={() => {window.location.href="/postQna"}}> Q & A </NavLink>
          <NavLink to={{pathname:"/ranking"}} style={categoryStyle} >
            의심 도메인
          </NavLink>
          <NavLink to="/service" style={categoryStyle}>CIDS 서비스 </NavLink>

        </Nav>
        {this.state.loginState ? 
        <Nav inline="true">
          <NavLink to="/user/edit" style={categoryStyle}>회원정보</NavLink>
          <Nav.Link variant="dark" onClick={this.logout} style={categoryStyle}>로그아웃</Nav.Link>
        </Nav>          
        :
        <Nav inline="true">
          <NavLink to="/user/join" style={categoryStyle}>회원가입</NavLink>
          <Nav.Link variant="dark" onClick={this.handleLoginFormShow} style={categoryStyle}>로그인</Nav.Link>
          <LoginForm show = {this.state.loginFormShow} showHandler={this.handleLoginFormShow}/>
        </Nav>
        }

      </Navbar.Collapse>
    </Navbar>
    
    </>
    )
  }

}

export default Header;