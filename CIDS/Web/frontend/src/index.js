import React from 'react';
import ReactDOM from 'react-dom';
import {}from 'react-bootstrap';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './header';
import Footer from './footer';
import Body from './body';
import {} from './css/index.css';

ReactDOM.render(
  <BrowserRouter>
    <Header/>
    <Body/>
    <Footer />
  </BrowserRouter>,
  document.querySelector('#container')
); 

