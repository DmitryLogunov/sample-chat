import Cookies from "js-cookie";
import React, { Component } from "react";
import HomeHead from "./partials/homeHead";
import { isEmpty, get } from "lodash";
import {Router} from '../bin/routes';
import Link from 'next/link'

import { authCookieName } from '../data/configuration/config.json';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionID: Cookies.get(authCookieName),
      login: Cookies.get('login')    
    };
  }

  /**
   *  Do before rendering
   */
  async componentWillMount() {
    if(this.state.sessionID === 'null') Router.push('/');
  }

  /**
   * Main rendering
   */
  render() {
    return (           
      <div> 
        <HomeHead />
        <div className="headerInfo">
          <div className="headerInfoContainer">              
            { this.renderUserInfo() }                                   
          </div>
        </div>  
        <div className="headerBlock">
          <div className="headerContainer">         
            <h1>Available chats</h1> 
            {/* <CommentsTypeDropdown updateCommentType={this.updateCommentType.bind(this)} commentType={this.state.commentType}/>         */}
          </div>
        </div>       
        <div className="container">
          <div className="row form-group">
              <div className="col-xs-12 col-md-offset-2 col-md-8 col-lg-8 col-lg-offset-2 chats-list-frame">
                  <div className="panel panel-primary">
                      <div className="panel-footer clearfix border-frame">  
                         <div className="chats-list">
                           <h3>Maintenances</h3>
                           <ul>
                             <li>
                               <Link href='/maintenance/123'><a>/maintenance/123</a></Link>
                             </li>
                             <li>
                               <Link href='/maintenance/345'><a>/maintenance/345</a></Link>
                             </li>
                             <li>
                               <Link href='/maintenance/567'><a>/maintenance/567</a></Link>
                             </li>                                                          
                           </ul>
                         </div>
                         <div className="chats-list">
                           <h3>Incidents</h3>
                           <ul>
                             <li>
                               <Link href='/incident/123'><a>/incident/123</a></Link>
                             </li>
                             <li>
                               <Link href='/incident/345'><a>/incident/345</a></Link>
                             </li>
                             <li>
                               <Link href='/incident/567'><a>/incident/567</a></Link>
                             </li>                                                          
                           </ul>                           
                         </div> 
                      </div>
                  </div>
              </div>
          </div>
        </div>                
      </div>      
    );
  } 

  /**
   * User info rendering
   */
  renderUserInfo() {
    if (isEmpty(this.state.sessionID) || isEmpty(this.state.login)) return;

    return (          
        <div className="userInfo">
          <span>User: </span> {this.state.login} <img src='/static/images/logout-icon.png' onClick={this.logout.bind(this)}/>
        </div>
    );
  }

  /**
   * The helper of logging out
   */
  logout() {
    Cookies.set(authCookieName, null);
    Cookies.set('login', null);
    this.setState({sessionID: null});  
    this.setState({login: null});  
    Router.push('/');
  } 
}

export default Home;