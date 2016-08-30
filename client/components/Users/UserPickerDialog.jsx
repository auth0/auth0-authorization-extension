import React, { Component } from 'react';

import './UserPickerDialog.styl';
import { Error, Confirm } from '../Dashboard';
import UserOverview from './UserOverview';
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
      <Confirm confirmMessage={confirmMessage} dialogClassName="user-picker-dialog" size="large" title={title} show={open} loading={loading} onCancel={onCancel} onConfirm={this.onConfirm}>
        <Error message={error} />
        <UserOverview onReset={onReset} onSearch={onSearch}
          error={error} users={records} total={total} loading={loading} renderActions={this.renderActions}
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
