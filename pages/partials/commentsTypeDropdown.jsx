import React, { Component } from "react";

class CommentsTypeDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commentType: 'comment'
    }
  }

  render() {
    return (
      <div className="dropdownCommentsType">
       <div className="commentsTypeTitle"><span>Comments type:</span></div>
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
          <div className="btn-title">{this.state.commentType}</div>
          <span className="caret"></span></button>
          <ul className="dropdown-menu">
            <li><a href="#" onClick={this.chooseCommentType('comment').bind(this)} >comment</a></li>
            <li><a href="#" onClick={this.chooseCommentType('chat').bind(this)}>chat</a></li>
            <li><a href="#" onClick={this.chooseCommentType('note').bind(this)}>note</a></li>
          </ul>
        </div>  
      </div>
    );
  }
  
  /**
   * The hadler for choosing dropdown value
   * @param {*} value 
   */
  chooseCommentType(value) {    
    return () => {
      this.setState({commentType: value});
      this.props.updateCommentType(value);
    }    
  }
}

export default CommentsTypeDropdown;