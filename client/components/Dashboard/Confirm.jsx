import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';

class Confirm extends Component {
  renderCancel() {
    if (this.props.onCancel) {
      return (
        <Button bsSize="large" bsStyle="transparent" disabled={this.props.loading} onClick={this.props.onCancel}>
          Cancel
        </Button>
      );
    }

    return null;
  }

  renderConfirm() {
    if (this.props.onConfirm) {
      return (
        <Button bsStyle="primary" bsSize="large" disabled={this.props.loading} onClick={this.props.onConfirm}>
          { this.props.confirmMessage || <span><i className="icon icon-budicon-499" /> Confirm</span> }
        </Button>
      );
    }

    return null;
  }

  render() {
    return (
      <Modal className={this.props.className} dialogClassName={this.props.dialogClassName} show={this.props.show} onHide={this.props.onCancel}>
        <Modal.Header className="has-border" closeButton={!this.props.loading}>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          {this.renderCancel()}
          {this.renderConfirm()}
        </Modal.Footer>
      </Modal>
    );
  }
}

Confirm.propTypes = {
  dialogClassName: PropTypes.string,
  confirmMessage: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  className: PropTypes.string
};

export default Confirm;
