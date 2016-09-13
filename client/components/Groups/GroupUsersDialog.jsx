import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Multiselect from '../Dashboard/Multiselect';

class GroupUsersDialog extends React.Component {
  render() {
    const group = this.props.group.toJS();
    const title = `Manage ${group.record.name} users`;
    const isVisible = group.isEditUsers;

    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.props.onClose}>
        <Modal.Header closeButton={!group.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-description">Add or remove members from this group.</p>
          <label>Add members</label>
          <Multiselect
            options={[
              { value: 'ariel', label: 'Ariel Gerstein', email: 'ariel@auth0.com' },
              { value: 'victor', label: 'Victor Fernandez', email: 'victor@auth0.com' },
              { value: 'ricky', label: 'Ricky Rauch', email: 'ricky@auth0.com' },
              { value: 'cherna', label: 'Tomas Cherna', email: 'cherna@auth0.com' }
            ]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={group.loading || group.submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={group.loading || group.submitting}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

GroupUsersDialog.propTypes = {
  group: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

export default GroupUsersDialog;
