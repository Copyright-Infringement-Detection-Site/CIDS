import React, {Component} from "react";
import {FormControl, Image} from "react-bootstrap";
import {Button, Form,  } from 'semantic-ui-react';
import axios from "axios";
import {} from "jquery.cookie";
import searchIcon from '../assets/img/search.png'
import Typist from 'react-typist';
import background from '../assets/img/back.png'
import cogoToast from 'cogo-toast';

axios.defaults.withCredentials = true;

class ServicePage extends Component {
    
    constructor(props){
        super(props);
        this.state = {
          isPaid: false,
        }
      }
    
    componentDidMount() {
        this.checkPermission()

    }
    
    //유저의 결제 권한 확인
    checkPermission = () =>{
        axios.get('/api/user/checkPermission').then((res)=>{
            if(res.data.message){
                cogoToast.error(res.data.message);
                this.props.history.push("/login");
                this.setState({
                    isPaid: false
                });
            }
            else{
                this.setState({
                    isPaid: true
                });
            }
        })
    }
    notify = () => {
        cogoToast.success('This is a success message!');
    }

    search = () => {
        const keyword = this.keyword.value;

        if(keyword === ""){
            cogoToast.error("Keyword를 입력해주세요.");
            return;
        }


        if(this.state.isPaid===true) {
            axios.get('/api/search/authCheck').then((res)=>{
                if(res.data.message){
                    cogoToast.error(res.data.message);
                    setTimeout(function() {
                        window.location.href="/";
                    }, 500);
                }
                else{
                    axios.post('/api/search',{'keyword': keyword}).then((res) => {
                        cogoToast.success(res.data.message)
                        setTimeout(function() {
                            window.location.href="/";
                        }, 500);
                    }).catch((e) => {
                        cogoToast.error(e)
                    })
                }
            })

        }
        else{
            cogoToast.error("권한이 없습니다.")
        }
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.search()
        }
    };



        render() {

            const container = {
                paddingTop: "10%",
                backgroundImage: `url(${background})`,
                backgroundColor: 'white',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
            }

            const titleStyle = {
                marginTop: "6%",
                marginLeft: "30%",
                marginRight: "30%",
                textAlign: 'center',
                color: 'white',
                backgroundColor: '#00ABDF',
            };
            const formStyle = {
                marginTop: "8%",
                width: "50%",
                height: '100%',
                marginLeft: "25%",
                marginRight: "25%",
                marginBottom: "20%",
                paddingLeft: '2%',
                paddingRight: '1%',
                backgroundColor: 'white',
                border: "2px solid #00ABDF",
                borderRadius: "20px",
            };
            const formInputStyle = {
                marginTop: '5px',
                marginBottom: '5px',
                width: '100%',
                height: '40px',
                border: "0px",
                backgroundColor: 'rgba(256,256,256,0.3)',
                textAlign: 'center'
            }
            const buttonStyle = {
                marginTop: '5px',
                marginBottom: '5px',
                height: '40px',
                backgroundColor: 'rgba(256,256,256,0.2)'
            }
            const iconStyle = {
                marginTop: '10px',
                marginBottom: '10px',
                height: '30px',
            }

        return (
            <div className="full-height" style={container}>
                <div style={titleStyle}>
                    <h1>
                        <Typist>
                            Copyright Infringement Detection Site
                        </Typist>
                    </h1>
                </div>
                <Form>
                    <Form.Group style={formStyle}>
                        <Image src={searchIcon} style={iconStyle}/>
                        <FormControl style={formInputStyle}
                                     ref={ref => (this.keyword = ref)}
                                     onKeyPress={this.handleKeyPress}
                                     placeholder="keyword ( 추천: Keyword 무료보기, Keyowrd 다시보기 )"></FormControl>
                        <Button
                            onClick={this.search}
                            type="button"
                            style={buttonStyle}>
                            GO
                        </Button>
                    </Form.Group>

                </Form>
            </div>
        )
    }
}


export default ServicePage;

