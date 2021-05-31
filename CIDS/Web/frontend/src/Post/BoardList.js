import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {} from "../css/boardList.css";

class BoardList extends Component {
    state = {
      boards: [], 
      postType: "",
      boardName: ""   
    }
  
  //postType에 따라서 가져올 데이터 분기
  Category = () =>{

    let boards = [];

    boards.push({
      url: '/postNotice',
      postType: 'SUPER',
      boardName: "공지사항",
      boardImage: "/img/category/NoticeBoard.png"
    });
    boards.push({
      url: '/postDev',
      postType: 'DEVELOPER',
      boardName: "개발자 게시판",
      boardImage: "/img/category/DeveloperBoard.png"
    });
    boards.push({
      url: '/postCompany',
      postType: 'COMPANY',
      boardName: "업체 게시판",
      boardImage: "/img/category/CompanyBoard.png"
    });
    boards.push({
      url: '/postFree',
      postType: "Free",
      boardName: "자유 게시판"  ,
      boardImage: "/img/category/FreeBoard.png"    
    });
    return boards;
  }

  //component 시작하면 getPostIndex 함수 실행
  componentDidMount() {
    this.getBoardList();
  }
  
  getBoardList = () => {
    let boards = this.Category();
    const boardList = boards.map((board,index) =>(
      <div key={index} className="col-12 col-md-6 col-lg-6 d-flex flex-column bg-cover py-2" style={{maxWidth: '450px'}}>
        <NavLink to={board.url} className="text-white">
          <div className="card board-image" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${board.boardImage})`}}>
            <h3 className="board-name font-weight-bolder">{board.boardName}</h3>
            <div className="card-body mt-auto mb-n11 py-8">
            </div>
          </div>
        </NavLink>  
      </div>
    ));    
    this.setState({
      boards: boardList
    });
  }


  
  render() {
    const divStyle = {
      marginBottom: "3%"
    };
    

    return (
      <div className="container">
        <h1 style={{marginTop: "3%"}}>Board List</h1><br/>
        <div className="row justify-content-center" style={divStyle}>
          {this.state.boards}
        </div>
      </div>
    );
  }
}

export default BoardList;
