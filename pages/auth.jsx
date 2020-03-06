import AuthHead from "./partials/authHead";
import Cookies from "js-cookie";
import React, { Component } from "react";
import request from '../helpers/request';
import {Router} from '../bin/routes';

import authorizationRequestDataTemplate from '../data/request-templates/authorization';
import { sreApiV3URI, authorizationAccessToken, authCookieName } from '../data/configuration/config.json';

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionID: Cookies.get(authCookieName),
      username: '', 
      password: '',
      usernameLableVisibility: true,
      passwordLableVisibility: true,
      checkAuth: true
    };
  }

  /**
   *  Do before rendering
   */
  async componentWillMount() {
    console.log(`check sessionID: ${this.state.sessionID !== 'null'}, ${this.state.sessionID}`);
    if(typeof this.state.sessionID !== 'undefined' && this.state.sessionID !== 'null') Router.push('/home');
  }

  /**
   * Main rendering
   */
  render() {    
    return (      
      <div>
        <AuthHead />
        <hgroup>
          <h1>Authentication</h1>
        </hgroup>  
        <form>
          <div className="group">
            <input type="username" value={this.state.username} onChange={evt => this.updateInputValue('username', evt)}></input>
            { this.state.usernameLableVisibility ? <label>Username</label> : null }            
          </div>
          <div className="group">
            <input type="password" value={this.state.password} onChange={evt => this.updateInputValue('password', evt)}></input>
            { this.state.passwordLableVisibility ?  <label>Password</label> : null }            
          </div>
          { !this.state.checkAuth ? <div className="authErrorNotice">Username or password is wrong</div> : null }
          <button type="button" className="button buttonBlue"  onClick={this.sendAuthoruzationRequest.bind(this)}>Sign in
            <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div> 
          </button>
        </form>
      </div>
    );
  }

  /**
   * The handler of authorization request 
   */
  async sendAuthoruzationRequest() {   
    const data = authorizationRequestDataTemplate;
    data.data.attributes.user = this.state.username;
    data.data.attributes.password = this.state.password;

    const options = {
      url: `${sreApiV3URI}/sessions`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': authorizationAccessToken 
      },
      data      
    }
   
    const [authorizationResponseData, responseStatus] = await request(options);

    if (authorizationResponseData) {
      Cookies.set(authCookieName, authorizationResponseData.data[0].id);
      Cookies.set('login', authorizationResponseData.data[0].attributes.login);
      Router.push('/home');
    } else {
      console.log('Warnig: not success auth response!');
      this.setState({checkAuth: false});
    }    
  }

  /**
   * The helper of processing input of some field
   * 
   * @param {*} key 
   * @param {*} evt 
   */
  updateInputValue(key, evt) {
    this.setState({ [key]: evt.target.value });
    this.setState({checkAuth: true});

    switch(key) {
      case 'username': 
        this.setState({usernameLableVisibility: this.state[key].length > 0 ? false : true});
        break;
        case 'password': 
        this.setState({passwordLableVisibility: this.state[key].length > 0 ? false : true});
        break;          
    }
  }  
}

export default Auth;