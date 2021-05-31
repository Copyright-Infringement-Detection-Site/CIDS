import React, { Component } from "react";
import { Image, Table, Row, Col } from "react-bootstrap";
import {Input } from 'semantic-ui-react';
import axios from "axios";
import Moment from 'moment';
import ReactPaginate from 'react-paginate';
import {} from '../css/pagination.css';
axios.defaults.withCredentials = true;

//ranking Row
class RankingRow extends Component {

  constructor(props){
    super(props);
    this.state = {
      s3_url: 'https://s3.ap-northeast-2.amazonaws.com/userprofileimg/'
    }
  }

  /* Ranking 1,2,3 순위 이미지 표현 */
  showRanking = () =>{
    if( this.props.index === 1){
      return (<Image src="/img/ranking/1.png" width="25" height="30"/>)
    } 
    else if( this.props.index === 2){
      return (<Image src="/img/ranking/2.png" width="25" height="30"/>)
    }
    else if( this.props.index === 3){
      return (<Image src="/img/ranking/3.png" width="25" height="30"/>)
    }
    else {
      return this.props.index;
    }
  }

  render() {

    return (
      <tr style={{fontWeight:"600"}}>
        <td style={{textAlign:"center"}}>
          {this.showRanking()}
        </td>
        
        <td style={{textAlign:"center", marginTop:"10px",paddingTop:"17px"}}>
          {this.props.domain.url_domain}
        </td>
        <td style={{textAlign:"center", marginTop:"10px",paddingTop:"17px"}}>
          {Moment(this.props.domain.updated_date).format('YYYY-MM-DD HH:MM:SS')}
        </td>
        <td style={{textAlign:"center", marginTop:"10px",paddingTop:"17px"}}>
          {this.props.domain.hit}
        </td>
      </tr>
    );
  }
}

/* Ranking List */
class RankingIndex extends Component {
    state = {
      domains: [], 
      boardName: "",
      perPage: 10,
      pageNum: 0,
      totalItems: 0,
      keyword: ''
    }
  

  //component 시작하면 getRankingIndex 함수 실행
  componentDidMount() {
    this.getRankingIndex('all');
  }
  
  //rank List 가져오는 함수 
  getRankingIndex = (keyword) => {

    if(keyword === '')
      keyword = 'all'

    axios
      .get(`/api/countDomain/${keyword}`)
      .then(res => {
        let domains;
        if (res.data.domains.length > 0) {
          const domain_list = res.data.domains;
          domains = domain_list.map((domain,index) => (
            <RankingRow
              index = {index+1}
              domain = {domain}
              key = {index}
            />
          ));
          //user목록 state에 저장
          this.setState({
            domains: domains
          });
        } else {
          //게시글 못 찾은 경우
          domains = ([
            <tr key={0}>
              <td colSpan="4" style={{textAlign:"center"}}>도메인이 존재하지 않습니다.</td>
            </tr>
          ]);
          this.setState({
            domains: domains
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

  //search Change 반영
  handleKeywordChange = (e) => {
    this.setState({
      keyword : e.target.value
    })
  }

  //enter 반영
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.getRankingIndex(this.state.keyword);
    }
  };
  
  render() {
    const divStyle = {  
      marginTop: "3%",
      minWidth:"70%", 
      minHeight:"700px",
    };
    

    return (
      <div className="container" style={divStyle} >
        <div style={{marginBottom:"3%"}}>
          <Row>
            <Col sm={10}>
              <h2>탐색된 의심 도메인 순위</h2><br/>
            </Col>
            <Col sm={1}>
              <Input 
                focus placeholder='Search...' 
                value={this.state.keyword} 
                onChange={this.handleKeywordChange} 
                onKeyPress = {this.handleKeyPress}
              />
            </Col>

          </Row>
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr style={{textAlign:"center"}}>
                <th style={{width:"10%"}}>Ranking</th>
                <th style={{width:"60%"}}>Domain</th>
                <th style={{width:"20%"}}>Last Date</th>
                <th style={{width:"10%"}}>Hit</th>
              </tr>
            </thead>
            <tbody>{this.state.domains.slice(this.state.pageNum*this.state.perPage,this.state.pageNum*this.state.perPage+this.state.perPage)}</tbody>
          </Table>
          
        </div>
        <div>
          <ReactPaginate
            previousLabel={'이전'}
            nextLabel={'다음'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil((this.state.domains.length/this.state.perPage))}
            marginPagesDisplayed={0}
            pageRangeDisplayed={10}
            onPageChange={this.changePage}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
        <br/><br/><br/>
      </div>
    );
  }
}

export default RankingIndex;
