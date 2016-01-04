import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Error extends Component {
  onDismiss() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  render() {
    if (!this.props.message) {
      return this.props.children || <div></div>;
    }

    return <Alert bsStyle="danger" onDismiss={this.onDismiss.bind(this)} dismissAfter={this.props.dismissAfter || 10000}>
       <h4>Oh snap! You got an error!</h4>
       <p>{this.props.message}</p>
     </Alert>;
  }
}

Error.propTypes = {
  message: React.PropTypes.string,
  dismissAfter: React.PropTypes.number,
  onDismiss: React.PropTypes.func
};

export default Error;
