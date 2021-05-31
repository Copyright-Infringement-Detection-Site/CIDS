import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import { Grid,Card,Form, Segment, Image, Placeholder } from 'semantic-ui-react';
import axios from "axios";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;

class UserProfileModal extends Component {

  constructor(props){
    super(props);
    this.state = {
      user: '',
      s3_url: 'https://s3.ap-northeast-2.amazonaws.com/cidsprofileimg/',
    }
  }

  componentDidMount(){
    this.getUserInfo();
  }

  //user정보 가져오기
  getUserInfo = () => {
    this.setState({
      user: this.props.user
    });
  }


  render(){

    return (
      <div className="container">
      <Modal show={this.props.show} onHide={this.props.showHandler} style={{textAlign:"center"}} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            User Profile
          </Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <Segment style={{marginBottom: "20px", marginTop: "20px"}}>
      
            <Grid doubling columns={2} style={{marginBottom:"3%",marginTop:"3%"}}>
              <Grid.Column>
              <Card key={this.state.user.name} style={{width:"280px"}} >
                <Image src={this.state.s3_url + this.state.user.img_path} style={{height: "280px", width: "280px"}}/>
                <Placeholder>
                  <Card.Description>User Image</Card.Description>
                </Placeholder>
                <Card.Content>
                  {this.state.user.name} ({this.state.user.login_id})
                </Card.Content>
              </Card>
              </Grid.Column>
              <Grid.Column>
                <Form> 
                  <Form.Group widths={2}>
                    <Form.Input label="email" type="text" value={this.state.user.email} readOnly={true}/>  
                    <Form.Input label="telphone" type="text" value={this.state.user.telephone} readOnly={true}/>
                  </Form.Group>
                  <Form.Group widths={2}>
                    <Form.Input label="last name" type="text" value={this.state.user.last_name} readOnly={true}/>
                    <Form.Input label="first name" type="text" value={this.state.user.first_name} readOnly={true}/>
                  </Form.Group>
                </Form>
              </Grid.Column>
            </Grid>
          </Segment>
        </Modal.Body>
      </Modal>
     
      </div>
    );
  };
}
export default UserProfileModal;
