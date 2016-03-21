import React, { Component } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

class Confirm extends Component {
  renderCancel() {
    if (this.props.onCancel) {
      return (
        <Button bsSize="small" disabled={this.props.loading} onClick={this.props.onCancel}>
          Cancel
        </Button>
      );
    }

    return null;
  }

  renderConfirm() {
    if (this.props.onConfirm) {
      return (
        <Button bsStyle="success" bsSize="small" disabled={this.props.loading} onClick={this.props.onConfirm}>
          {this.props.confirmMessage || 'Confirm'}
        </Button>
      );
    }

    return null;
  }

  render() {
    return (
      <Modal dialogClassName={this.props.dialogClassName} show={this.props.show} onHide={this.props.onCancel}>
        <Modal.Header closeButton={!this.props.loading}>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            {this.renderCancel()}
            {this.renderConfirm()}
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

Confirm.propTypes = {
  dialogClassName: React.PropTypes.string,
  confirmMessage: React.PropTypes.string,
  loading: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func
};

export default Confirm;
