import React, { Component } from 'react';
import { Field } from 'redux-form';
import connectContainer from 'redux-static';
import { Error, Confirm, Multiselect } from 'auth0-extension-ui';

import createForm from '../../utils/createForm';
import UserPickerSelectAction from './UserPickerSelectAction';
import UserPickerUnselectAction from './UserPickerUnselectAction';
import { userActions } from '../../actions';

export default createForm('userPicker', connectContainer(class UserPickerDialog extends Component {
  constructor() {
    super();

    this.onConfirm = this.onConfirm.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  static propTypes = {
    userPicker: React.PropTypes.object.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    onSelectUser: React.PropTypes.func.isRequired,
    onUnselectUser: React.PropTypes.func.isRequired,
    fetchUsers: React.PropTypes.func.isRequired,
    totalUsers: React.PropTypes.number,
    users: React.PropTypes.array
  };

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

  shouldComponentUpdate(nextProps) {
    return nextProps.userPicker !== this.props.userPicker;
  }

  onConfirm() {
    /* @todo add handleSubmit */
    this.props.onConfirm(this.props.userPicker.get('selection').toJS());
  }

  renderActions(user, index) {
    if (this.props.userPicker.get('selection').findIndex((userId) => userId === user.user_id) > -1) {
      return (
        <UserPickerUnselectAction index={index} user={user} loading={this.props.userPicker.get('loading')} onUnselect={this.props.onUnselectUser} />
      );
    }

    return (
      <UserPickerSelectAction index={index} user={user} loading={this.props.userPicker.get('loading')} onSelect={this.props.onSelectUser} />
    );
  }

  render() {
    const { onCancel, onReset, onSearch } = this.props;
    const { title, error, records, selection, total, open, loading } = this.props.userPicker.toJS();

    const confirmMessage = selection.length ? `Add ${selection.length} Users` : 'Confirm';

    return (
      <Confirm className="modal-overflow-visible" confirmMessage={confirmMessage} title={title} show={open} loading={loading} onCancel={onCancel} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p className="modal-description">
          Add or remove members from this group.
        </p>
        <label htmlFor="">Add Members</label>
        <Field
          name="members"
          component={Multiselect}
          loadOptions={this.getOptions}
        />
      </Confirm>
    );
  }
}));
