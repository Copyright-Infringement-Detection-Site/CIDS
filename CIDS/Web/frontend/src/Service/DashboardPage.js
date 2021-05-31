import React, {Component} from "react";
import Dashboard from "../components/Dashboard";
import axios from "axios";

class DashboardPage extends Component {
    state = {
        domains:[],
        today_user_count : 0,
        total_user_count : 0,
        today_keyword_count : 0,
        search_dates : [],
        search_counts : [],
        accuracy : 0,
    }

    getKeywordCount = () =>{
        axios.get(`/api/dashboard/keywordinfo`)
            .then(res =>{
                if(res.data.keyword_count){
                    this.setState({
                        today_keyword_count : res.data.keyword_count,
                    });
                }
                else{
                    this.setState({
                        today_keyword_count : 0,
                    });
                }
            })
    }

    getUserCount = () =>{
        axios.get(`/api/dashboard/userinfo`)
            .then(res =>{
                if(res.data){
                    this.setState({
                        total_user_count : res.data.total_cnt,
                        today_user_count : res.data.today_cnt
                    });
                }
                else{
                    this.setState({
                        total_user_count : 0,
                        today_user_count : 0
                    });
                }
            })
    }

    getDomainList = () => {
        axios
            .get(`/api/dashboard/domain`)
            .then(res => {
                if (res.data.domains.length > 0) {
                    const domain_list = res.data.domains.slice(0,5);
                    this.setState({
                        domains: domain_list
                    });
                }
                else{
                    this.setState({
                        domains: []
                    });
                }
            })
    }

    getAccuracy = () =>{
        axios
            .get(`/api/dashboard/accuracy`)
            .then(res=>{
                if(res.data.accuracy){
                    this.setState({
                        accuracy: res.data.accuracy
                    })
                }
                else{
                    this.setState({
                        accuracy: 0
                    })
                }
            })
    }

    getDomainSearchInfo = () =>{
        axios
            .get(`/api/dashboard/domaininfo`)
            .then(res => {
                this.setState({
                    search_dates: res.data.search_dates,
                    search_counts: res.data.search_counts,
                });
            })
    }

    componentDidMount() {
        this.getKeywordCount()
        this.getUserCount()
        this.getDomainList()
        this.getAccuracy()
        this.getDomainSearchInfo()

        this.interval = setInterval(()=>{
            this.getKeywordCount()
            this.getUserCount()
            this.getDomainList()
            this.getAccuracy()
            this.getDomainSearchInfo()
        }, 60000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                <Dashboard
                    domains={this.state.domains}
                    today_user_count={this.state.today_user_count}
                    total_user_count={this.state.total_user_count}
                    today_keyword_count = {this.state.today_keyword_count}
                    search_dates = {this.state.search_dates}
                    search_counts = {this.state.search_counts}
                    accuracy = {this.state.accuracy}
                ></Dashboard>
            </div>
        );
    }
}

export default DashboardPage;