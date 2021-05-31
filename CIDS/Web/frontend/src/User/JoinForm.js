import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import {} from "jquery.cookie";
import cogoToast from "cogo-toast"; //로그인, 로그아웃 처리 (쿠키값이 있으면 게시글 보여주고, 쿠키값 없으면 회원가입, 로그인 보여줌)
axios.default.withCredentials = true; // node.js server와 통신 구현 -> 동일 기원(host)가 아니여도 접근할 수 있도록 구현 

class JoinForm extends Component {
  //회원가입
  join = () => {
    const joinId = this.joinId.value;
    const joinEmail = this.joinEmail.value;
    const joinLastName = this.joinLastName.value;
    const joinFirstName = this.joinFirstName.value;
    const joinPw = this.joinPw.value;
    const telphone = this.telphone.value;


    const telPhoneRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
    const idRegExp = /^[0-9a-zA-Z]{4,15}$/; 
    const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const pwRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    
    if (joinId === "" || joinId === undefined) {
      cogoToast.warn("가입할 아이디를 입력해주세요.");
      this.joinId.focus();
      return;
    } 
    else if (
      joinId.match(idRegExp) === null ||joinId.match(idRegExp) === undefined) {
      cogoToast.warn("아이디 형식에 맞게 입력해주세요.");
      this.joinId.value = "";
      this.joinId.focus();
      return;
    }
    
    if (joinEmail === "" || joinEmail === undefined) {
      cogoToast.warn("이메일 주소를 입력해주세요.");
      this.joinEmail.focus();
      return;
    } 
    else if (
      joinEmail.match(emailRegExp) === null ||joinEmail.match(emailRegExp) === undefined) {
      cogoToast.warn("이메일 형식에 맞게 입력해주세요.");
      this.joinEmail.value = "";
      this.joinEmail.focus();
      return;
    } 
    
    if (joinLastName === "" || joinLastName === undefined) {
      cogoToast.warn("성을 입력해주세요.");
      this.joinLastName.focus();
      return;
    }

    if (joinFirstName === "" || joinFirstName === undefined) {
      cogoToast.warn("이름을 입력해주세요.");
      this.joinFirstName.focus();
      return;
    }

    if (joinPw === "" || joinPw === undefined) {
      cogoToast.warn("비밀번호를 입력해주세요.");
      this.joinPw.focus();
      return;
    } 
    else if ( joinPw.match(pwRegExp) === null || joinPw.match(pwRegExp) === undefined) {
      cogoToast.warn("비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");
      this.joinPw.value = "";
      this.joinPw.focus();
      return;
    }

    if(telphone.match(telPhoneRegExp) === null || telphone.match(telPhoneRegExp) === undefined){
      cogoToast.warn("핸드폰 형식을 맞게 입력해주세요.");
      this.telphone.value = "";
      this.telphone.focus();
      return;
    }

    const send_param = {
      loginId: joinId,
      email: joinEmail,
      lastname: joinLastName,
      firstname: joinFirstName,
      passwd: joinPw,
      telphone: telphone
    };
    axios
      .post("/api/user/register", send_param)
      //정상 수행
      .then(returnData => {
        if (returnData.data.message) {
          cogoToast.success(returnData.data.message);

          //Id 중복 체크
          if (returnData.data.dupIdCheck) {
            this.joinId.value = "";
            this.joinId.focus();
          }
          //이메일 중복 체크
          else if (returnData.data.dupEmailCheck){
            this.joinEmail.value = "";
            this.joinEmail.focus();
          }
          //home으로 보내야함
          else {
            window.location.href="/";
          }
        }
        else {
          cogoToast.error("회원가입 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const formStyle = {
      width: "80%"
    };
    const buttonStyle = {
      marginTop: 10
    };
    const centerStyle ={
      marginLeft: "15%",
      marginRight: "15%",
      border:"solid 1px gray",
      backgroundColor:"#FFFFFF"
    }

    return (
    <div style={{backgroundColor:"#edf1f1"}} >
      <center style={centerStyle }>
      <h1 style={{marginTop:"3%"}}>회원가입</h1>
      <Form  style={formStyle}>
        <Form.Group controlId="joinId">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="id"
            maxLength="30"
            ref={ref => (this.joinId = ref)}
            placeholder="ID ( 숫자와 문자포함 4~15 자리 ) (필수)"
          />
        </Form.Group>
        <Form.Group controlId="joinPw">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            maxLength="64"
            ref={ref => (this.joinPw = ref)}
            placeholder="Password (필수)"
          />
        </Form.Group>
        <Form.Group controlId="joinEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            maxLength="100"
            ref={ref => (this.joinEmail = ref)}
            placeholder="Enter email (필수)"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="joinLastName">
          <Form.Label>last name</Form.Label>
          <Form.Control
            type="text"
            maxLength="20"
            ref={ref => (this.joinLastName = ref)}
            placeholder="last name"
          />
        </Form.Group>
        <Form.Group controlId="joinFirstName">
          <Form.Label>first name</Form.Label>
          <Form.Control
              type="text"
              maxLength="20"
              ref={ref => (this.joinFirstName = ref)}
              placeholder="first name"
          />
        </Form.Group>
        <Form.Group controlId="joinTelPhone">
          <Form.Label>telphone</Form.Label>
          <Form.Control
            type="text"
            maxLength="20"
            ref={ref => (this.telphone = ref)}
            placeholder="telphone (형식: xxx-xxxx-xxxx)"
          />
        </Form.Group>
        <Form.Group controlId="joinBtn">
          <Button
            style={buttonStyle}
            onClick={this.join}
            variant="dark"
            type="button"
            block
          >
            회원가입
          </Button>
        </Form.Group>
      </Form>
      <br/>
      </center>
    </div>
    );
  }
}

export default JoinForm;
