import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Moment from 'moment';
import ReactPaginate from 'react-paginate';
import {} from '../css/pagination.css';
axios.defaults.withCredentials = true;

//post 하나당 출력
class PostRow extends Component {

  createdDateFormat = (date) =>{
    return Moment(date).format('YYYY-MM-DD');
  }

  render() {
    return (
      <tr>
        <td style={{textAlign:"center"}}>
          {this.props.index}
        </td>
        <td >
          <NavLink style={{color: "black"}}
            to={{ pathname: `/post/show/${this.props.post._id}` ,query:{ 
            }}}
          >
            {this.props.post.title}
          </NavLink>
        </td>
        <td style={{textAlign:"center"}}> 
          {this.props.post.user_login_id}
        </td>
        <td style={{textAlign:"center"}}>
          {this.createdDateFormat(this.props.post.created_date)}
        </td>
        <td style={{textAlign:"center"}}>
          {this.props.post.hit}
        </td>
      </tr>
    );
  }
}

class PostIndex extends Component {
    state = {
      posts: [], 
      postType: "",
      boardName: "",
      perPage: 10,
      pageNum: 0,
      totalItems: 0,
      auth : 'visiter'
    }
  
  //postType에 따라서 가져올 데이터 분기
  Category = () =>{
    if(this.props.match.url === '/postNotice'){
      this.setState({
        postType: "notification",
        boardName: "공지사항"
      });
      return { post_type: "notification"}
    }
    else if(this.props.match.url === '/postQna'){
      this.setState({
        postType: "qna",
        boardName: "Q & A"
      });
      return {post_type: "qna"}
    }
  }

  //component 시작하면 getPostIndex 함수 실행
  componentDidMount() {
    
    this.getPostIndex();
  }
  
  getPostIndex = () => {
    const send_param = this.Category();
    
    /* 권한 체크ajax */
    axios
    .get("/api/user/checkAuth",{},{withCredentials: true})
      .then((res)=>{
        if(res.data === '로그인이 필요합니다.'){
          this.setState({
            auth: 'visiter'
          });
          this.props.history.push("/login");
        } else{
          this.setState({
            auth : res.data.user_auth
          });
        }

      })
      .then(
        axios // 실제 post List 가져오기 
        .get(`/api/post/${send_param.post_type}`)
        .then(returnData => {
          let posts;
          if (returnData.data.length > 0) {
            const returnedPosts = returnData.data;
            posts = returnedPosts.map((post,index) => (
              <PostRow
                index = {index+1}
                post = {post}
                key = {index}
              />
            ));
            //post목록 state에 저장
            this.setState({
              posts: posts
            });
          } else {
            //게시글 못 찾은 경우
            posts = ([
              <tr>
                <td colSpan="5" style={{textAlign:"center"}}>게시글이 존재하지 않습니다.</td>
              </tr>
            ]);
            this.setState({
              posts: posts
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
      );
    
    
    
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
        {this.state.auth === 'admin' || (this.state.postType === 'qna' && this.state.auth !== 'visiter' )?
          <div style={{marginBottom:"3%"}}>
            <h2 >{this.state.boardName}<NavLink to={{pathname:"/post/new", query:{post_type: this.state.postType}}} className="float-right"><Button variant="secondary">게시글 작성</Button></NavLink></h2>
          </div>
          :
          <div style={{marginBottom:"3%"}}>
            <h2>{this.state.boardName}</h2>
          </div>
        }
        <div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr style={{textAlign:"center"}}>
                <th style={{width:"10%"}}>#</th>
                <th style={{width:"40%"}}>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회</th>
              </tr>
            </thead>
            <tbody>{this.state.posts.slice(this.state.pageNum*this.state.perPage,this.state.pageNum*this.state.perPage+this.state.perPage)}</tbody>
          </Table>
        </div>
        <div>
          <ReactPaginate
            previousLabel={'이전'}
            nextLabel={'다음'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil((this.state.posts.length/this.state.perPage))}
            marginPagesDisplayed={0}
            pageRangeDisplayed={10}
            onPageChange={this.changePage}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={"pagination"}
            previousClassName={"pagination"}
            nextClassName={"pagination"}
            previousLinkClassName={"pagination"}
            nextLinkClassName={"pagination"}

          />
        </div>
      </div>
    );
  }
}

export default PostIndex;
