import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Error, Confirm, Multiselect } from 'auth0-extension-ui';

import createForm from '../../utils/createForm';
import UserPickerSelectAction from './UserPickerSelectAction';
import UserPickerUnselectAction from './UserPickerUnselectAction';

export default createForm('userPicker', class UserPickerDialog extends Component {
  constructor() {
    super();

    this.renderActions = this.renderActions.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.onCancel = this.onCancel.bind(this);
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
    users: React.PropTypes.array,
    reset: React.PropTypes.func.isRequired
  };

  getOptions(input, callback) {
    // TODO: this.props.totalUsers changes over time > what should be the solution?
    // if (this.props.totalUsers < process.env.MAX_MULTISELECT_USERS) {
    //   callback(null, {
    //     options: this.props.users,
    //     complete: true
    //   });
    // } else {
      const query = `name:${input}* OR email.raw:${input}* OR user_metadata.name:${input}*`;
      this.props.fetchUsers(query, null, true, null, null, () => {
        callback(null, {
          options: this.props.users,
          complete: false
        });
      });
    // }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userPicker !== this.props.userPicker;
  }

  onCancel() {
    this.props.reset();
    this.props.onCancel();
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
    const { onReset, onSearch } = this.props;
    const { title, error, records, selection, total, open, loading } = this.props.userPicker.toJS();

    const confirmMessage = selection.length ? `Add ${selection.length} Users` : 'Confirm';

    return (
      <Confirm className="modal-overflow-visible" confirmMessage={confirmMessage} title={title} show={open} loading={loading} onCancel={this.onCancel} onConfirm={this.props.handleSubmit}>
        <Error message={error} />
        <p className="modal-description">
          Add members to this group.
        </p>
        <label htmlFor="">Add Members</label>
        <Field
          name="members"
          component={Multiselect}
          loadOptions={_.debounce((input, callback) => {
            return this.getOptions(input, callback);
          }, process.env.MULTISELECT_DEBOUNCE_MS)}
        />
      </Confirm>
    );
  }
});
