import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/user';

import { TableAction } from '../components/Dashboard';
import UserOverview from '../components/Users/UserOverview';
import BlockUserDialog from '../components/Users/BlockUserDialog';
import UnblockUserDialog from '../components/Users/UnblockUserDialog';
import RemoveMultiFactorDialog from '../components/Users/RemoveMultiFactorDialog';

class Users extends React.Component {
  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.renderUserActions = this.renderUserActions.bind(this);
  }

  componentWillMount() {
    this.props.fetchUsers();
  }

  onSearch(query) {
    this.props.fetchUsers(query);
  }

  onReset() {
    this.props.fetchUsers('', true);
  }

  getMultifactorAction(user, index) {
    if (!user.multifactor || !user.multifactor.length) {
      return <div></div>;
    }

    return <TableAction id={`remove-mfa-${index}`} type="success" title={`Remove MFA (${user.multifactor[0]})`} icon="243"
      onClick={() => this.props.requestRemoveMultiFactor(user)} disabled={this.props.loading || false} />;
  }

  getBlockedAction(user, index) {
    if (user.blocked) {
      return <TableAction id={`unblock-${index}`}  title="Unblock User" icon="284"
        onClick={() => this.props.requestUnblockUser(user)} disabled={this.props.loading || false} />;
    }

    return <TableAction id={`block-${index}`} type="success" title="Block User" icon="284"
      onClick={() => this.props.requestBlockUser(user)} disabled={this.props.loading || false} />;
  }

  renderUserActions(user, index) {
    return (
      <div>
        {this.getMultifactorAction(user, index)} {this.getBlockedAction(user, index)}
      </div>
    );
  }
    /*
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    users: React.PropTypes.array.isRequired,
    total: React.PropTypes.number.isRequired,
    loading: React.PropTypes.bool.isRequired,
    renderActions: React.PropTypes.func.isRequired*/

  render() {
    if (this.props.children) {
      return this.props.children;
    }

    const { loading, error, users, total } = this.props;
    const { mfa, block, unblock } = this.props.dialogs;

    return (
      <div>
        <BlockUserDialog error={block.get('error')} loading={block.get('loading')} userName={block.get('userName')} requesting={block.get('requesting')}
          onCancel={this.props.cancelBlockUser} onConfirm={this.props.blockUser} />
        <UnblockUserDialog error={unblock.get('error')} loading={unblock.get('loading')} userName={unblock.get('userName')} requesting={unblock.get('requesting')}
          onCancel={this.props.cancelUnblockUser} onConfirm={this.props.unblockUser} />
        <RemoveMultiFactorDialog error={mfa.get('error')} loading={mfa.get('loading')} userName={mfa.get('userName')} requesting={mfa.get('requesting')}
          onCancel={this.props.cancelRemoveMultiFactor} onConfirm={this.props.removeMultiFactor} />

        <UserOverview onReset={this.onReset} onSearch={this.onSearch}
          error={error} users={users} total={total} loading={loading} renderActions={this.renderUserActions} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dialogs: {
      mfa: state.mfa,
      block: state.block,
      unblock: state.unblock
    },
    error: state.users.get('error'),
    loading: state.users.get('loading'),
    users: state.users.get('records').toJS(),
    total: state.users.get('total'),
    nextPage: state.users.get('nextPage')
  };
}

export default connect(mapStateToProps, actions)(Users);
