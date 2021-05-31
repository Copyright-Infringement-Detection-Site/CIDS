import React from "react";
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Search from '@material-ui/icons/Search';
import Person from '@material-ui/icons/Person';
import Location from '@material-ui/icons/LocationSearching';
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
// core components
import { TableSimple } from 'react-pagination-table';
import GridItem from "./Grid/GridItem.js";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardIcon from "./Card/CardIcon.js";
import CardBody from "./Card/CardBody.js";
import CardFooter from "./Card/CardFooter.js";
import Chartist from "chartist";

import styles from "../assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);


export default function Dashboard(d) {
    const classes = useStyles();
    const dashStyle = {
        marginTop: "3%",
        marginLeft: "10%",
        marginRight: "10%"
    };

    const chart_data =  {
        labels: d.search_dates,
       series: [d.search_counts]
    }


    return (

        <div style={dashStyle}>
            <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="info" stats icon>
                            <CardIcon color="info">
                                <Search/>
                            </CardIcon>
                            <p className={classes.cardCategory}>일일 키워드 검색 수</p>
                            <h3 className={classes.cardTitle}>{d.today_keyword_count}<small>개</small></h3>

                        </CardHeader>
                        <CardFooter stats>
                            { d.today_keyword_count?
                                <div className={classes.stats}>
                                    <Update />
                                    updated few seconds ago
                                </div>
                                :
                                <div className={classes.stats}>
                                    -
                                </div>
                            }
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="success" stats icon>
                            <CardIcon color="success">
                                <Person />
                            </CardIcon>
                            <p className={classes.cardCategory}>사용자 수</p>
                            <h3 className={classes.cardTitle}>{d.total_user_count}<small>명</small></h3>

                        </CardHeader>
                        <CardFooter stats>
                            <div className={classes.stats}>
                                <ArrowUpward/>
                                {d.today_user_count} increase
                            </div>

                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="danger" stats icon>
                            <CardIcon color="danger">
                                <Location/>
                            </CardIcon>
                            <p className={classes.cardCategory}>평균 정확도</p>
                            <h3 className={classes.cardTitle}>{d.accuracy}<small>%</small></h3>


                        </CardHeader>
                        <CardFooter stats>
                            { d.accuracy?
                                <div className={classes.stats}>
                                    <Update />
                                    updated few seconds ago
                                </div>
                                :
                                <div className={classes.stats}>
                                    -
                                </div>
                            }

                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={10} sm={10} md={7}>
                    <Card chart>
                        <CardHeader color="primary">
                            <ChartistGraph
                                data={chart_data}
                                type='Line'
                                options={{
                                    lineSmooth: Chartist.Interpolation.cardinal({
                                        tension: 0,
                                    }),
                                    showArea: true,
                                    showLine: false,
                                    height: 220,
                                    low: 0, // creative tim: we recommend you to set the high sa the biggest value + something for a better look

                                }}
                                style={{fill:'white', fillOpacity:0.5, width: '110%', height:'100%', marginRight:'2%'}}
                            />
                        </CardHeader>
                        <CardBody>
                            <h4 className={classes.cardTitle}>탐지된 도메인 수</h4>
                            <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> {d.search_counts[6]}
                </span>{" "}
                                increase in today
                            </p>
                        </CardBody>
                        <CardFooter>
                            <div className={classes.stats}>
                                <AccessTime /> updated today
                            </div>
                        </CardFooter>
                    </Card>
                </GridItem>

                <GridItem xs={12} sm={12} md={5}>
                    <Card>
                        <CardHeader color="warning">
                            <h4 className={classes.cardTitleWhite}>의심 도메인 Top 5</h4>
                            <a href="/ranking" className={classes.cardCategoryWhite}>
                                더보기
                            </a>
                        </CardHeader>
                        <CardBody>
                            <div className={classes.stats}>
                                2021년 5월 3일 기준
                            </div>
                            <TableSimple
                                headers={['Rank', 'Domain']}
                                data={d.domains}
                                columns="rank.domain"
                                arrayOption={ [["rank", 'domain']] }
                            />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
