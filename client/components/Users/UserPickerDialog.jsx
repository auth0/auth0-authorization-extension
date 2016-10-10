import React, { Component } from 'react';

import { Error, Confirm } from '../Dashboard';
import Multiselect from '../Dashboard/Multiselect';
import UserPickerSelectAction from './UserPickerSelectAction';
import UserPickerUnselectAction from './UserPickerUnselectAction';

class UserPickerDialog extends Component {
  constructor() {
    super();

    this.onConfirm = this.onConfirm.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userPicker !== this.props.userPicker;
  }

  onConfirm() {
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
        <Multiselect
          options={[
            { value: 'ariel', label: 'Ariel Gerstein', email: 'ariel@auth0.com' },
            { value: 'victor', label: 'Victor Fernandez', email: 'victor@auth0.com' },
            { value: 'ricky', label: 'Ricky Rauch', email: 'ricky@auth0.com' },
            { value: 'cherna', label: 'Tomas Cherna', email: 'cherna@auth0.com' }
          ]}
        />
      </Confirm>
    );
  }
}

UserPickerDialog.propTypes = {
  userPicker: React.PropTypes.object.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onReset: React.PropTypes.func.isRequired,
  onSearch: React.PropTypes.func.isRequired,
  onSelectUser: React.PropTypes.func.isRequired,
  onUnselectUser: React.PropTypes.func.isRequired
};

export default UserPickerDialog;
