import _ from 'lodash';
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
    resetFetchUsers: React.PropTypes.func.isRequired,
    totalUsers: React.PropTypes.number,
    users: React.PropTypes.array,
    loading: React.PropTypes.bool.isRequired,
    submitting: React.PropTypes.bool,
    handleSubmit: React.PropTypes.func.isRequired,
    reset: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  getOptions(input, callback) {
    const query = `name:${input}* OR email.raw:${input}* OR user_metadata.name:${input}* OR user_id:${input}`;
    this.props.fetchUsers(query, null, true, null, null, () => {
      callback(null, {
        options: this.props.users,
        complete: false
      });
    });
  }

  onClose() {
    this.props.reset();
    this.props.onClose();
    this.props.resetFetchUsers();
  }

  handleSubmit = () => {
    this.props.handleSubmit();
    this.props.resetFetchUsers();
  }

  render() {
    const group = this.props.group.toJS();
    const title = `Add members to ${group.record.name}`;
    const isVisible = group.isEditUsers;

    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.onClose}>
        <Modal.Header closeButton={!group.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-description">
            Select one or more users you wish to add to this group.
          </p>
          <Field
            name="members"
            component={Multiselect}
            loadOptions={_.debounce((input, callback) => this.getOptions(input, callback), process.env.MULTISELECT_DEBOUNCE_MS)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={group.loading || group.submitting} onClick={this.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={group.loading || group.submitting} onClick={this.handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});
