import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import cogoToast from "cogo-toast";
axios.defaults.withCredentials = true;

class PwChangeModalForm extends Component {
  
  state = {
    show: false,
  }
  
  componentDidMount() {
    this.setState({
      show: this.props.show
    });
  }
  

  //비밀번호 변경
  pwChange = () => {
    const currentPw = this.currentPw.value;
    const newPw = this.newPw.value;
    const pwRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    const confirmNewPw = this.confirmNewPw.value;

    if (currentPw === "" || currentPw === undefined) {
      cogoToast.warn("현재 비밀번호를 입력해주세요.");
      this.currentPw.focus();
      return;
    } 
    else if (newPw === "" || newPw === undefined) {
      cogoToast.warn("새로운 비밀번호를 입력해주세요.");
      this.newPw.focus();
      return;
    } 
    else if (confirmNewPw === "" || confirmNewPw === undefined) {
      cogoToast.warn("새로운 비밀번호 확인을 입력해주세요.");
      this.confirmNewPw.focus();
      return;
    }
    if (newPw.match(pwRegExp) === null || newPw.match(pwRegExp) === undefined )
    {
      cogoToast.warn("새로운 비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");
      this.newPw.value = "";
      this.confirmNewPw = "";
      this.newPw.focus();
      return;
    }
    
    
    if (confirmNewPw !== newPw){
      cogoToast.warn("새로운 비밀번호가 새로운 비밀번호 확인과 다릅니다. 새로운 비밀번호 확인을 다시 입력해주세요!");
      this.confirmNewPw.value = '';
      this.confirmNewPw.focus();
      return;
    }

    const send_param = {
      //headers,
      currentPw: this.currentPw.value,
      newPw: this.newPw.value
    };
    axios
      .put(`/api/user/${$.cookie('login_id')}/changePw`, send_param)
      //정상 수행
      .then(response => {
        if (response.data.check) {
          cogoToast.success(response.data.message);
          this.setState({
            show: false
          });
          this.props.showHandler();
          
        } 
        else {
          cogoToast.warn(response.data.message);
          this.currentPw.value = '';
          this.newPw.value = '';
          this.confirmNewPw.value = '';
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.pwChange();
    }
  };

  render() {
    const buttonStyle = {
      marginTop: 10
    };

    return (
      <Modal show={this.props.show} onHide={this.props.showHandler}>
      <Modal.Header closeButton>
      <Modal.Title>비밀번호 변경</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form className="container">
        <Form.Group>
          <Form.Label>현재 비밀번호</Form.Label>
          <Form.Control
            type="password"
            maxLength="20"
            ref={ref => (this.currentPw = ref)}
            placeholder="Enter Current Password"
            onKeyPress={this.handleKeyPress}
          />
          <br/>
          <Form.Label>새로운 비밀번호</Form.Label>
          <Form.Control
            type="password"
            maxLength="20"
            ref={ref => (this.newPw = ref)}
            placeholder="Enter New Password"
            onKeyPress={this.handleKeyPress}
          />
          <br/>
          <Form.Label>새로운 비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            maxLength="20"
            ref={ref => (this.confirmNewPw = ref)}
            placeholder="Enter New Password Confirm"
            onKeyPress={this.handleKeyPress}
          />
          <br/>
          <Button
            style={buttonStyle}
            onClick={this.pwChange}
            variant="dark"
            type="button"
            block
          >
            비밀번호 변경
          </Button>
        </Form.Group>
      </Form>
      </Modal.Body>
      </Modal>
     
    );
  }
}

export default PwChangeModalForm;