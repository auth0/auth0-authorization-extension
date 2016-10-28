import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';
import { Multiselect } from 'auth0-extension-ui';

import createForm from '../../utils/createForm';

export default createForm('groupMembers', class GroupMembersDialog extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    fetchUsers: React.PropTypes.func.isRequired,
    totalUsers: React.PropTypes.number,
    users: React.PropTypes.array,
    loading: React.PropTypes.bool.isRequired,
    submitting: React.PropTypes.bool,
    handleSubmit: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions(input, callback) {
    if (this.props.totalUsers < process.env.MAX_MULTISELECT_USERS) {
      callback(null, {
        options: this.props.users,
        complete: true
      });
    }

    if (this.props.totalUsers > process.env.MAX_MULTISELECT_USERS &&
      input.length >= process.env.MAX_MULTISELECT_INPUT_CHAR) {
      this.props.fetchUsers(`name:${input}*`);
      callback(null, {
        options: this.props.users
      });
    }
  }

  render() {
    const group = this.props.group.toJS();
    const title = `Add members to ${group.record.name}`;
    const isVisible = group.isEditUsers;

    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.props.onClose}>
        <Modal.Header closeButton={!group.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-description">Add members to this group.</p>
          <label>Add members</label>
          <Field
            name="members"
            component={Multiselect}
            loadOptions={this.getOptions}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={group.loading || group.submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={group.loading || group.submitting} onClick={this.props.handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});
