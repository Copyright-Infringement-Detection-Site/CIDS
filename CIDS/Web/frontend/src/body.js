import React, { Component } from "react";
import JoinForm from "./User/JoinForm";
import LoginForm from "./User/LoginForm";
import PostIndex from "./Post/PostIndex";
import PostNewForm from "./Post/PostNewForm";
import PostShow from "./Post/PostShow";
import UserPageForm from "./User/UserPageForm";
import HomepageForm from "./HomePage/HomePage";
import { Route, Switch } from "react-router-dom";
import BoardList from "./Post/BoardList"
import RankingIndex from "./Service/RankingIndex";
import ServicePage from "./Service/ServicePage";
import DashboardPage from './Service/DashboardPage'
import {CssBaseline} from "@material-ui/core";
import LoginPage from "./LoginPage";
import InvalidPage from "./404Page";

class Body extends Component {
  render() {
    return (
      <CssBaseline>
          <div >
            <Switch>
              <Route path="/boardList" component={BoardList}/>

              <Route path="/post/new" component={PostNewForm}/>
              <Route path="/post/show/:id" component={PostShow}/>
              <Route path="/post/edit/:id" component={PostNewForm}/>
              <Route path="/postQna" component={PostIndex} />
              <Route path="/postNotice" component={PostIndex} />

              <Route path="/user/edit" component={UserPageForm}/>
              <Route path="/user/login" component={LoginForm}/>
              <Route path="/user/join" component={JoinForm}/>
              <Route path="/dashboard" component={DashboardPage}/>
              <Route path="/ranking" component={RankingIndex}/>
              <Route path="/login" component={LoginPage}/>

              <Route path="/service" component={ServicePage}/>

              <Route exact path="/" component={HomepageForm}/>

              <Route path="/*" component={InvalidPage}/>
            </Switch>
          </div>
      </CssBaseline>
    );
  }
}

export default Body;
