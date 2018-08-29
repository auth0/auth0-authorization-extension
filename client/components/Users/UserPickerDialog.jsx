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
    resetFetchUsers: React.PropTypes.func.isRequired,
    totalUsers: React.PropTypes.number,
    users: React.PropTypes.array,
    reset: React.PropTypes.func.isRequired
  };

  getOptions(input, callback) {
    const useSEv3 = window.config.SEARCH_ENGINE === 'v3';
    const query = useSEv3
      ? `name:${input}* OR email:${input}*`
      : `name:${input}* OR email.raw:${input}* OR user_metadata.name:${input}*`;
    this.props.fetchUsers(query, null, true, null, null, () => {
      callback(null, {
        options: this.props.users,
        complete: false
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userPicker !== this.props.userPicker;
  }

  onCancel() {
    this.props.reset();
    this.props.onCancel();
    this.props.resetFetchUsers();
  }

  handleSubmit = () => {
    this.props.handleSubmit();
    this.props.resetFetchUsers();
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
      <Confirm className="modal-overflow-visible" confirmMessage={confirmMessage} title={title} show={open} loading={loading} onCancel={this.onCancel} onConfirm={this.handleSubmit}>
        <Error message={error} />
        <p className="modal-description">
          Select one or more users you wish to add to this group.
        </p>
        <form className="form-horizontal">
          <div className="row">
            <div className="col-xs-12">
              <Field
                name="members"
                component={Multiselect}
                loadOptions={_.debounce((input, callback) => this.getOptions(input, callback), process.env.MULTISELECT_DEBOUNCE_MS)}
              />
            </div>
          </div>
        </form>
      </Confirm>
    );
  }
});
