import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { Multiselect } from 'auth0-extension-ui';

import createForm from '../../utils/createForm';
import UsersTablePicker from '../Users/UsersTablePicker';
import { userActions } from '../../actions';

export default createForm('groupMembers', connectContainer(class GroupMembersDialog extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    fetchUsers: React.PropTypes.func.isRequired,
    totalUsers: React.PropTypes.number,
    users: React.PropTypes.array
  };

  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
  }

  static stateToProps = (state) => {
    const stateUsers = state.users.get('records').toJS();
    let users;
    if (stateUsers && stateUsers.length) {
      users = _.map(stateUsers, (user) => ({
        value: user.user_id,
        label: user.name,
        email: user.email
      }));
    }

    return {
      totalUsers: state.users.get('total'),
      users
    };
  };

  static actionsToProps = {
    ...userActions
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
            loadOptions={this.getOptions}
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
}));
