import React, { Component } from "react";
import axios from "axios";
import Moment from 'moment';
import { Comment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import UserProfileModal from "../User/UserProfileModal";
import {} from "../css/commentForm.css";
import $ from 'jquery';
import {} from 'jquery.cookie';
import {} from '../css/userProfile.css';
import ReactPaginate from 'react-paginate';
import {} from '../css/pagination.css';
import cogoToast from 'cogo-toast';

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const bucket = 'https://s3.ap-northeast-2.amazonaws.com/cidsprofileimg/';


//Comment 하나당 출력
class CommentRow extends Component {
  constructor(props2){
    super(props2);
    this.state = {
      editForm: false,
      content: '',
      modified_date: '',
      userProfileModalShow: false,
      user: ''
    }
  }

  componentDidMount(){
    this.setState({
      content: this.props.comment.content,
      modified_date: this.props.comment.modified_date,
      user: this.props.user
    });
  }

  DateFormat = (date) =>{
    return Moment(date).format('YYYY-MM-DD hh:mm:ss');
  }
  deleteComment = () =>{
    const send_param = {
      headers
    };
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`/api/comment/delete/${this.props.comment._id}`, send_param)
        //정상 수행
        .then((response) => {
          if(response.data.message){
            cogoToast.success("댓글이 삭제 되었습니다.");

            this.props.deleteCheck(this.props.comment._id);
          }
          else {
            cogoToast.error("댓글삭제에 실패했습니다.");
          }
          })
        //에러
        .catch(err => {
          console.log(err);
          cogoToast.error("댓글 삭제 실패");
        });
    }
    else {
      //
    }
  }

  editComment = () =>{
    this.setState({
      editForm: true
    });
  }

  updateComment = () =>{

    if(window.confirm('정말 수정하시겠습니까?')){
      this.setState({
        editForm:false
      });
      const send_param = {
        headers,
        content: this.state.content
      }
      axios
        .put(`/api/comment/update/${this.props.comment._id}`, send_param)
        .then(response => {
          if(response.data.message){
            this.setState({
              modified_date: response.data.comment.modified_date
            })
            cogoToast.success("댓글이 수정되었습니다.");
          }
          else{
            cogoToast.error("댓글 수정에 실패했습니다.");
          }
        })
        .catch(err =>{
          //console.log(err);
          cogoToast.error("댓글 수정에 실패했습니다.");
        })
    }   
  }
  
    //유저 프로필 show 컨트롤
  handleUserProfileShow = () =>{

    this.setState({

      userProfileModalShow: !this.state.userProfileModalShow
    });
  }

  onEnterPress = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.updateComment();
    }
  }

  handleChange = (e) =>{
    this.setState({
      content: e.target.value
    });
  }

  render() {

    const imgStyle ={
      borderRadius:"50%", 
      overflow:"hidden", 
      marginLeft:"15px", 
      cursor:"pointer", 
      marginRight:"15px",
      border:"3px solid #fff",
      boxShadow: "0 0 16px rgb(221,221,221)"
    }

    return (
      <>
      <Comment style={{marginBottom:20}}>
        <Comment.Avatar 
          onClick={this.handleUserProfileShow} 
          className="userProfile" 
          src={bucket + this.state.user.img_path} 
          style={imgStyle} /> 
        <Comment.Content>
          <Comment.Author onClick={this.handleUserProfileShow}  as='a'>{this.props.user.last_name+this.props.user.first_name}</Comment.Author>

        {!this.state.editForm ?
        <>
          <Comment.Metadata>
            <div>{this.DateFormat(this.props.comment.modified_date)}</div>
          </Comment.Metadata>
          <Comment.Text>{this.state.content}</Comment.Text> 
                
            {this.props.comment.user_login_id === $.cookie('login_id')
            ?
              <>
              <Comment.Actions style={{ paddingLeft:"15px"}}>
                <Comment.Action onClick={this.editComment}> 수정 </Comment.Action>
                <Comment.Action onClick={this.deleteComment.bind(this.props.comment._id)}> 삭제 </Comment.Action>
              </Comment.Actions>
              </>
            : <><Comment.Actions/></>
            }
        </>
        :        
          <div className="comment_div" style={{marginTop:"10px", borderBottom: "none"}}>
            <div className='comment_write' style={{ borderBottom: "none"}}>
              <textarea 
                rows='3'
                maxLength='100'
                value = {this.state.content}
                onKeyDown={this.onEnterPress}
                onChange={this.handleChange}
              >
              </textarea>
              <input type='button' id='comment_submit_button' value='수정' onClick={this.updateComment} /> 
            </div>
          </div>         
        }
        
        </Comment.Content>
      </Comment>
      <UserProfileModal user={this.props.user} show ={this.state.userProfileModalShow} showHandler={this.handleUserProfileShow}/>    
      </>
    );
  }
}

class CommentIndex extends Component {
    state = {
      comments: [],
      perPage: 10,
      pageNum: 0,
      totalItems: 0
    }
  


  //component 시작하면 getCommentIndex 함수 실행
  componentDidMount() {
    this.getCommentIndex();
  }
  
  deleteCheck=(deletedComment_id) =>{
    let tmp = this.state.comments;
    this.setState({
      comments: tmp.filter(data => data.props.comment._id !== deletedComment_id)
    })
    
  }

  getCommentIndex = () => {
    const send_param ={post_id: this.props.post_id};
    axios
      .get(`/api/comment/show/${send_param.post_id}`)
      .then(response => {
        let comments;
        if (response.data.commentAndUserInfos) {
          const commentAndUserInfos = response.data.commentAndUserInfos;
          comments = commentAndUserInfos.map((commentAndUserInfo, index) => (
            <CommentRow
              comment = {commentAndUserInfo.comment}
              user = {commentAndUserInfo.user}
              key = {index}
              deleteCheck = {this.deleteCheck}
            />
          ));
          //Comment목록 state에 저장
          this.setState({
            comments: comments
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //pagenation
  changePage = (select) =>{
    this.setState({
      pageNum: select.selected
    });
  }

  
  render() {
    const divStyle = {
      marginTop: "3%",
      minWidth:"70%", 
      minHeight:"700px",
    };
    

    return (
      <div className="container" style={divStyle} >
         <Comment.Group size='large'>
          {this.state.comments.slice(this.state.pageNum*this.state.perPage,this.state.pageNum*this.state.perPage+this.state.perPage)}         
         </Comment.Group>
        <div>
          <ReactPaginate
            previousLabel={'이전'}
            nextLabel={'다음'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil((this.state.comments.length/this.state.perPage))}
            marginPagesDisplayed={0}
            pageRangeDisplayed={10}
            onPageChange={this.changePage}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      </div>
    );
  }
}

export default CommentIndex;
