import React, { Component } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

class Confirm extends Component {
  render() {
    return <Modal show={this.props.show} onHide={() => this.props.onCancel()}>
      <Modal.Header closeButton={!this.props.loading}>
        <Modal.Title>{this.props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.props.children}
      </Modal.Body>
      <Modal.Footer>
        <ButtonToolbar>
          <Button bsSize="small" disabled={this.props.loading} onClick={() => this.props.onCancel()}>
            Cancel
          </Button>
          <Button bsStyle="success" bsSize="small" disabled={this.props.loading} onClick={() => this.props.onConfirm()}>
            Confirm
          </Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>;
  }
}

Confirm.propTypes = {
  title: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
};

export default Confirm;
