import React, { Component } from "react";
import {Router} from '../../bin/routes';
import {map, forEach} from 'lodash';

class InfoBlock extends Component {
  constructor(props) {
    super(props);
     
    console.log(`props: ${JSON.stringify(props)}, ${JSON.stringify(this.props)}`);
    this.state = {
      chatInfo: {},
      infoStatus: true,
      showInfoText: false
    }
  }

   /**
   * Do before rendering
   */
  async componentWillMount() {
    setTimeout(() => {
      if(typeof this.props.getChatInfo === 'function') {
        const chatInfo = this.props.getChatInfo();
        this.setState({chatInfo}, () => {
          this.refreshChatInfoStatus();
        });
      }      
    }, 1000);
  }

  renderChatInfo() {
    if (this.props.notVisibleChatInfo) return;

    const chatInfoList = map(this.state.chatInfo, (value, key) =>{
      return <li key={ key }><a><span>{key}:</span> {value}</a></li>;
    })

    return (
      <div>
        <div className="infoIcon" onMouseOver={this.showInfo.bind(this)} onMouseOut={this.hideInfo.bind(this)}>
          { 
            this.state.infoStatus ? 
            <img src='/static/images/info-icon-ok.png'></img> :
            <img src='/static/images/info-icon-err.png'></img>
          }
        </div>
        { 
          this.state.showInfoText ? 
          <div className="infoText">
            <ul className="dropdown-menu">              
              {chatInfoList}
            </ul>
          </div> : 
          null 
        }
      </div>      
    );
  }

  /**
   * Component rendering
   */
  render() {
    return (
      <div className="infoBlock">
        <div className="goHome"><img src='/static/images/home-icon.png' onClick={this.goHome.bind(this)}></img></div>
          { this.renderChatInfo() }      
      </div>
    );
  }  
  
  /**
   * Redirect to Home
   */
  goHome() {
    Router.push('/home');
  }
  
  /**
   * Chat info status refreshing
   */
  refreshChatInfoStatus() {  
    let infoStatus = true;   
    forEach(this.state.chatInfo, (value, key) => {
      if (!value) infoStatus = false;                
    });
    this.setState({infoStatus});
  }

  /**
   * Showing info
   */
  showInfo() {   
    if(!this.props.getChatInfo) return;

    const chatInfo = this.props.getChatInfo();
    this.setState({chatInfo}, () => {
      this.refreshChatInfoStatus();
      this.setState({showInfoText: true});
    });    
  }

  /**
   * Hidding info
   */
  hideInfo() {    
    this.setState({showInfoText: false});
 }
}

export default InfoBlock;