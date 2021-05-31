import React, {Component} from "react";
import axios from "axios";
import $ from "jquery";
import cogoToast from 'cogo-toast';
import {Button, Form} from "react-bootstrap";

class LoginPage extends Component {
    componentDidMount() {

    }

    //로그인
    login = () => {
        const loginId = this.loginId.value;
        const loginPw = this.loginPw.value;

        if (loginId === "" || loginId === undefined) {
            cogoToast.warn("아이디를 입력해주세요.");
            this.loginId.focus();
            return;
        } else if (loginPw === "" || loginPw === undefined) {
            cogoToast.warn("비밀번호를 입력해주세요.");
            this.loginPw.focus();
            return;
        }

        const send_param = {
            //headers,
            login_id: this.loginId.value,
            passwd: this.loginPw.value
        };
        axios
            .post("/api/user/login", send_param)
            //정상 수행
            .then(response => {
                if (response.data.token) {

                    // expire 3시간으로 설정
                    $.cookie("token", response.data.token, { expires: 0.125});
                    $.cookie("login_id", response.data.user_id, { expires: 0.125});

                    axios.defaults.headers.common['x-access-token'] = response.data.token;
                    cogoToast.success("로그인에 성공했습니다.");
                    window.location.href="/";
                }
                else {
                    cogoToast.error(response.data.message);
                    this.loginId.value = "";
                    this.loginPw.value = "";
                }
            })
            //에러
            .catch(err => {
                console.log(err);
            });
    };

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.login();
        }
    };


    render(){

        const formStyle = {
            width: "80%"
        };
        const buttonStyle = {
            marginTop: 30
        };
        const centerStyle ={
            paddingTop: "10%",
            marginLeft: "15%",
            marginRight: "15%",
            paddingBottom: "10%",
            backgroundColor:"#FFFFFF"
        }

        return (
            <div style={{backgroundColor:"#edf1f1"}} >
                <center style={centerStyle }>
                    <h1 style={{marginTop:"3%", marginBottom:"5%"}}>로그인</h1>
                    <Form  style={formStyle}>
                        <Form.Group controlId="loginId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="id"
                                maxLength="30"
                                ref={ref => (this.loginId = ref)}
                                placeholder="ID"
                                onKeyPress={this.handleKeyPress}
                            />
                        </Form.Group>
                        <Form.Group controlId="loginPw">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                maxLength="64"
                                ref={ref => (this.loginPw = ref)}
                                placeholder="Password"
                                onKeyPress={this.handleKeyPress}
                            />
                        </Form.Group>

                        <Form.Group controlId="joinBtn">
                            <Button
                                style={buttonStyle}
                                onClick={this.login}
                                variant="dark"
                                type="button"
                                block
                            >
                                로그인
                            </Button>
                        </Form.Group>
                    </Form>
                    <br/>
                </center>
            </div>
        );
    }
}

export default LoginPage;