import React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as actions from '../../actions/user';

import { Error, LoadingPanel, TableTotals } from '../../components/Dashboard';
import UsersTable from '../../components/Users/UsersTable';
import BlockUserDialog from '../../components/Users/BlockUserDialog';
import UnblockUserDialog from '../../components/Users/UnblockUserDialog';
import RemoveMultiFactorDialog from '../../components/Users/RemoveMultiFactorDialog';

class Users extends React.Component {
  componentWillMount() {
    this.props.fetchUsers();
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.fetchUsers(findDOMNode(this.refs.search).value);
    }
  }

  onReset() {
    this.props.fetchUsers('', true);
  }

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

        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={error} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10">
            <div className="advanced-search-control">
              <span className="search-area">
                <i className="icon-budicon-489"></i>
                <input className="user-input" type="text" ref="search" placeholder="Search for users" spellCheck="false"
                  style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress.bind(this)} />
              </span>
            </div>
          </div>
          <div className="col-xs-2">
            <ButtonToolbar className="pull-right">
              <Button bsSize="xsmall" onClick={this.onReset.bind(this)} disabled={loading}>
                <i className="icon icon-budicon-257"></i> Reset
              </Button>
            </ButtonToolbar>
          </div>
          <div className="col-xs-12">
            <div className="help-block">To perform your search, press <span className="keyboard-button">enter</span>. You can also search for specific fields, eg: <strong>email:"john@doe.com"</strong>.</div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <LoadingPanel show={loading}>
              <UsersTable loading={loading} users={users}
                removeMultiFactor={(user) => this.props.requestingRemoveMultiFactor(user)}
                blockUser={(user) => this.props.requestingBlockUser(user)}
                unblockUser={(user) => this.props.requestingUnblockUser(user)} />
            </LoadingPanel>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <TableTotals currentCount={users.length} totalCount={total} />
          </div>
        </div>
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
