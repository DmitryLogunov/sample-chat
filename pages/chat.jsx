import Cookies from "js-cookie";
import ChatHead from "./partials/chatHead";
import CommentsTypeDropdown from './partials/commentsTypeDropdown';
import { isEmpty, isEqual, get, map, sortBy } from "lodash";
import InfoBlock from "./partials/infoBlock";
import InputChatComment from "./partials/inputChatComment";
import OutputChatComment from "./partials/outputChatComment";
import React, { Component } from "react";
import request from '../helpers/request';
import faker from 'faker';
import {Router} from '../bin/routes';
import WebSocket from 'websocket';


import { sreApiV3URI, authCookieName, webSocketServerUrl, debugMode } from '../data/configuration/config';
import sendCommentRequestDataTemplate from '../data/request-templates/send-comment';

const WebSocketClient = WebSocket.w3cwebsocket;

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionID: Cookies.get(authCookieName),
      login: Cookies.get('login'),
      accountID: null,
      contextTypeID: null,
      contextType: null,
      contextID: null,      
      commentType: 'comment',
      commentTypeID: null,
      inputComment: '',
      comments: [],
      isLastCommentRequestStatusOK: true,
      lastSendingCommentResponseStatus: null
    }
    
    this.tryWSInitializingInterval = null;
    this.wsClientStatus = false;

    this.accountsCache = {}; 
  }

 
  /**
   * Do before rendering
   */
  async componentWillMount() {  
    if(this.state.sessionID === 'null') Router.push('/');

    if (!this.state.accountID) {
      await this.setAccountID();
    }
     
    const [prefix, context_type, context_id] = this.props.url.asPath.replace('#','').split('/');

    if (!this.state.contextType) {
      await this.setState({contextType: `${context_type}s`});
    }

    if (!this.state.contextID) {
      await this.setState({contextID: context_id});
    }

    if (!this.state.contextTypeID) {
      const contextTypeID = await this.getDictionaryValueByTitle(this.state.contextType);
      await this.setState({contextTypeID});
    }

    if (!this.state.commentTypeID) {
      const commentTypeID = await this.getDictionaryValueByTitle(this.state.commentType);
      await this.setState({commentTypeID});
    }
 
    await this.downloadCommentsHistory();
    
    this.tryWSInitializingInterval = setInterval(() => {
      this.wsInitializing();
    }, 5000);    
  }

  /**
   * 
   */
  wsInitializing() {
    if (this.wsClientStatus) return;

    if (this.wsClient) this.wsClient.close();
    this.wsClient = new WebSocketClient(webSocketServerUrl, 'echo-protocol');

    const subscribingMessage = {type: "subscribe", resource: "comments", contextType: this.state.contextType, contextID: this.state.contextID};
    
    this.wsClient.onopen = () => {
      setTimeout(() =>{
        console.log('WS connection has been established');
        this.wsClient.send(JSON.stringify(subscribingMessage));
        this.wsClientStatus = true;       
      }, 3000);
    }; 
    
    
    this.wsClient.onclose = () => {
      console.log('WS connection has been closed. Trying reconnecting...');
      this.wsClientStatus = false;     
    };
  
    this.wsClient.onmessage = (message) => {
      this.onIncommingMessage(message);
    };
  }

  /**
   * Main rendering
   */
  render() {
    return (           
      <div>  
         <ChatHead />
        { this.renderChat() }              
      </div>
    );
  }

  /**
   * Chat rendering
   */
  renderChat() {
    if (!this.state.sessionID) return;

    const listComments = this.state.comments.map( (c, i) => {
        if ( c.type === "input" ) {
          return <InputChatComment key={ i } username={ c.username } comment={ c.comment } createdAt={ c.createdAt} />
        }
        return <OutputChatComment  key={ i } username={ c.username } comment={ c.comment } createdAt={ c.createdAt} />
      }
    ); 

    return (           
      <div> 
        <div className="headerInfo">
          <div className="headerInfoContainer">
          { this.renderUserInfo() } 
          <InfoBlock getChatInfo={this.getChatInfo.bind(this)}/>                             
          </div>
        </div>  
        <div className="headerBlock">
          <div className="headerContainer">         
             <h1>Chat</h1> 
             <CommentsTypeDropdown updateCommentType={this.updateCommentType.bind(this)} commentType={this.state.commentType}/>        
          </div>
        </div>       
        <div className="container">
          <div className="row form-group">
              <div className="col-xs-12 col-md-offset-2 col-md-8 col-lg-8 col-lg-offset-2 comments-frame">
                  <div className="panel panel-primary">
                      <div className="panel-body body-panel">
                          <ul className="chat">
                            { listComments }
                          </ul>
                      </div>
                      <div className="panel-footer clearfix">
                          <textarea className="form-control" rows="3" 
                                    value = { this.state.inputComment }
                                    onChange={evt => this.updateInputValue('inputComment', evt)}>                            
                          </textarea>    
                          { !this.state.isLastCommentRequestStatusOK ? 
                            <div className="requestErrorNotice">The error of sending comment. 
                            { this.state.lastSendingCommentResponseStatus ? ` Response status: ${this.state.lastSendingCommentResponseStatus}` : null }
                            </div> 
                            : 
                            null 
                          }     
                          <span className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-xs-12">
                            <span>
                              <button className="btn btn-warning btn-lg btn-block btn-random-msg" id="btn-chat" onClick={this.generateRandomMessage.bind(this)}>Random message</button>
                            </span>
                            <span>
                              <button className="btn btn-warning btn-lg btn-block btn-send" id="btn-chat" onClick={this.sendComment.bind(this)}>Send</button>
                            </span> 
                          </span>                                           
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


  /**
   * The helper of setting account id
   */
  async setAccountID() {
    const [responseAccountData, responseStatus] = await this.getAccountData(this.state.login, 'login');

    if (responseAccountData && responseAccountData.data.length > 0) {
      await this.setState({accountID: responseAccountData.data[0].id});
    }
  }
  
  /**
   * Chat info getter
   */
  getChatInfo() {
    return { 
      accountID: this.state.accountID, 
      contextTypeID: this.state.contextTypeID, 
      contextType: this.state.contextType, 
      contextID: this.state.contextID, 
      commentType: this.state.commentType, 
      commentTypeID: this.state.commentTypeID 
    };
  }
   
  /**
   * Generates random comment
   */
  generateRandomMessage() {
   this.setState({inputComment: faker.lorem.text()});
  }

  /**
   * 
   * @param {*} value 
   */
  updateCommentType(value) {
    this.setState({ commentType: value }, async () => {
      const commentTypeID = await this.getDictionaryValueByTitle(this.state.commentType);
      await this.setState({commentTypeID});          
    });
  }

  /**
   * The helper of processing input of some field
   * 
   * @param {*} key 
   * @param {*} evt 
   */
  updateInputValue(key, evt) {
    this.setState({ 
      [key]: evt.target.value, 
      isLastCommentRequestStatusOK: true,
      lastSendingCommentResponseStatus: null });    
  }

  /**
   * The helper of sending comment
   */
  async sendComment() {
    const inputComment = this.state.inputComment;
    this.setState({ inputComment: '' });   
  
    if (!this.state.accountID) {
      console.log(`Error: account ID is not defined!`);
      this.setState({isLastCommentRequestStatusOK: false, lastSendingCommentResponseStatus: null});
      return;
    }  

    const data = sendCommentRequestDataTemplate;
    data.data.attributes.text = inputComment;
    data.data.relationships.account.data.id = `${this.state.accountID}`;
    data.data.relationships.resource_type.data.id = `${this.state.contextTypeID}`;
    data.data.relationships.context.data.type = `${this.state.contextType}`;
    data.data.relationships.context.data.id = `${this.state.contextID}`;
    data.data.relationships.comment_type.data.id = `${this.state.commentTypeID}`;

    const options = {
      url: `${sreApiV3URI}/comments`,
      method: 'POST',      
      headers: {
        'Content-Type': 'application/json',
        'session-id': this.state.sessionID
      },
      data
    }

    const [responseAddCommentData, responseStatus] = await request(options);

    if (responseAddCommentData) {
      const comments = this.state.comments;
      comments.push({
        type: "output",
        username: this.state.login,
        comment: inputComment,
        createdAt: Date.parse(Date())
      });
      this.setState({comments});
    } else {
      console.log(`Warnig: the error of sending comment. Options: ${JSON.stringify(options)}!`);
      this.setState({isLastCommentRequestStatusOK: false, lastSendingCommentResponseStatus: responseStatus});
    }
  }
  
  /**
   * Processes incoming message
   * 
   * @param {*} message 
   */
  async onIncommingMessage(messageData) {    
    let message;        
    try {
      message = JSON.parse(messageData.data);
      if (get(message, 'type') !== 'ping' || debugMode === 'true') {
        console.log(`Incomming WS message: ${JSON.stringify(message)}`);
      }      
    } catch {
      console.log(`Warning: failed of parsing incomming ws message: ${messageData.data}`);
      return;
    };
    
    if(get(message, 'type') === 'ping') {
      const wsConnectionID = get(message, 'wsConnectionID');   
      const pongMsg = {wsConnectionID, type: 'pong'};
      this.wsClient.send(JSON.stringify(pongMsg));
      return;
    }

    const commentID =  get(message, 'content.new.data[0].id');
    const commentText = get(message, 'content.request.data.attributes.text');    
    const commentAccountID = parseInt(get(message, 'content.request.data.relationships.account.data.id'), 10); 

    if (!commentID || !commentAccountID || commentAccountID <= 0 || !commentText) {
      console.log(`Warning: invalid incomming ws message: ${message}`);
      return;
    }    
    
    const [responseAccountData, responseAccountDataStatus] = await this.getAccountData(commentAccountID, 'id');
    if (!responseAccountData || responseAccountData.data.length === 0 || !get(responseAccountData, 'data[0].attributes.login')) {
      console.log(`Warning: invalid response of user data request. Respose data: ${JSON.stringify(responseAccountData)}`);
      return;
    }  

    const commentLogin = responseAccountData.data[0].attributes.login; 
    if (commentLogin === this.state.login) return;

    const [responseCommentData, responseCommentDataStatus] = await this.getCommentByID(commentID);
    const createdAt = Date.parse(get(responseCommentData, 'data[0].attributes.created_at'));

    const comments = this.state.comments;
    comments.push({
      type: "input",
      username: commentLogin,
      comment: commentText,
      createdAt
    });
    this.setState({comments});
  }  
  
  /**
   * Downloads comments history
   */
  async downloadCommentsHistory() {
    const filter = `filter[context_resource]=${this.state.contextTypeID}&filter[context.id]=${this.state.contextID}&filter[comment_type.id]=${this.state.commentTypeID}`
    const options = {
      url: `${sreApiV3URI}/comments/?${filter}`,
      method: 'GET',
      headers: {
        'session-id': this.state.sessionID
      }
    }
    const [responseCommentsHistoryData, responseStatus] = await request(options);
    
    if (!responseCommentsHistoryData || responseCommentsHistoryData.data.length === 0) return;

    const parsedResponseCommentsHistory = await Promise.all(
      map(responseCommentsHistoryData.data, async (comment) => {
        const accountID = parseInt(comment.relationships.account.data.id, 10);
        const commentText = comment.attributes.text;
        const createdAt = Date.parse(comment.attributes.created_at);
  
        let username = get(this.accountsCache, accountID);
  
        if (!username) {
          const [responseAccountData, responseStatus] = await this.getAccountData(accountID, 'id');
          
          username = get(responseAccountData, 'data[0].attributes.login');
          if (!username) {
            console.log(`Warning: invalid response of user data request. Respose data: ${JSON.stringify(accountID)}. Comment ID: ${comment.id}`);
          } 
  
          if (!isEmpty(username)) {
            this.accountsCache[accountID] = username;
          }
        }
        
        return {
          type: parseInt(accountID, 10) == parseInt(this.state.accountID, 10) ? 'output' : 'input',
          username,
          comment: commentText,
          createdAt  
        }
      })
    );

    const comments = sortBy(parsedResponseCommentsHistory, ['createdAt']);
    this.setState({comments});  
  } 


   /**
   * The helper of setting account id
   */
  async getAccountData(value, filterType) {
    const filter = filterType == 'login' ? `filter[login]=${value}` : `filter[id]=${value}`;
    const options = {
      url: `${sreApiV3URI}/accounts?${filter}`,
      method: 'GET',
      headers: {
        'session-id': this.state.sessionID
      }
    } 
    return await request(options);
  }

  /**
   * The helper for sending request to dictionary API
   * @param {*} title 
   */
  async getDictionaryValueByTitle(title) {
    const options = {
      url: `${sreApiV3URI}/dictionaries/?filter[title]=${title}`,
      method: 'GET',
      headers: {
        'session-id': this.state.sessionID
      }
    } 

    const [responseDictionaryData, responseStatus] = await request(options);

    return get(responseDictionaryData, 'data[0].id');
  }

  /**
   * Returns comment
   * 
   * @param {*} commentID 
   */
  async getCommentByID(commentID) {
    const options = {
      url: `${sreApiV3URI}/comments/${commentID}`,
      method: 'GET',
      headers: {
        'session-id': this.state.sessionID
      }
    };

    return await request(options);    
  }
}

export default Chat;