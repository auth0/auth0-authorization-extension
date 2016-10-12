import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';

import createForm from '../../utils/createForm';
import Multiselect from '../Dashboard/Multiselect';
import UsersTablePicker from '../Users/UsersTablePicker';

export default createForm('groupMembers', class GroupMembersDialog extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    onClose: PropTypes.func
  };

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
          <Field
            name="members"
            component={Multiselect}
            options={[
              { value: 'ariel', label: 'Ariel Gerstein', email: 'ariel@auth0.com' },
              { value: 'victor', label: 'Victor Fernandez', email: 'victor@auth0.com' },
              { value: 'ricky', label: 'Ricky Rauch', email: 'ricky@auth0.com' },
              { value: 'cherna', label: 'Tomas Cherna', email: 'cherna@auth0.com' }
            ]}
          />
        { /* @todo: Add UsersTablePicker component with users data  */}
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={group.loading || group.submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={group.loading || group.submitting}> {/* @todo add handleSubmit */}
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});
