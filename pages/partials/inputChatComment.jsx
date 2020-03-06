import React, { Component } from "react";
import datetimeFormatter from '../../helpers/datetime';
class InputChatComment extends Component {
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
        <li className="left clearfix">
          <span className="chat-img pull-left">
            <img
              src="http://placehold.it/50/55C1E7/fff&text=U"
              alt="User Avatar"
              className="img-circle"
            />
          </span>
          <div className="chat-body clearfix">
            <div className="header">
              <strong className="primary-font">{ this.state.username }</strong>{" "}
              <small className="pull-right text-muted">
                <span className="glyphicon glyphicon-time" />{datetimeFormatter(this.state.createdAt)}
              </small>
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

export default InputChatComment;
