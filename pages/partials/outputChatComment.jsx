import React, { Component } from "react";
import datetimeFormatter from '../../helpers/datetime';

class OutputChatComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username,
      comment: props.comment,
      createdAt: props.createdAt
    }
  }

  render() {
    return (
      <div>
        <li className="right clearfix">
          <span className="chat-img pull-right">
            <img
              src="http://placehold.it/50/FA6F57/fff&text=ME"
              alt="User Avatar"
              className="img-circle"
            />
          </span>
          <div className="chat-body clearfix">
            <div className="header">
              <small className=" text-muted">
                <span className="glyphicon glyphicon-time" />{datetimeFormatter(this.state.createdAt)}
              </small>
              <strong className="pull-right primary-font">{ this.state.username }</strong>
            </div>
            <p>
              { this.state.comment }
            </p>
          </div>
        </li>
      </div>
    );
  }  
}

export default OutputChatComment;
