import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';

import { TableAction, Table, TableCell, TableRouteCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class UsersTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.users !== this.props.users;
  }

  getMultifactorAction(user, index) {
    if (!user.multifactor || !user.multifactor.length) {
      return <div></div>;
    }

    return <TableAction id={`remove-mfa-${index}`} type="success" title={`Remove MFA (${user.multifactor[0]})`} icon="243"
      onClick={() => this.props.removeMultiFactor(user)} disabled={this.props.loading || false} />;
  }

  getBlockedAction(user, index) {
    if (user.blocked) {
      return <TableAction id={`unblock-${index}`}  title="Unblock User" icon="284"
        onClick={() => this.props.unblockUser(user)} disabled={this.props.loading || false} />;
    }

    return <TableAction id={`block-${index}`} type="success" title="Block User" icon="284"
      onClick={() => this.props.blockUser(user)} disabled={this.props.loading || false} />;
  }

  render() {
    const { users } = this.props;
    return <Table>
      <TableHeader>
        <TableColumn width="6%"/>
        <TableColumn width="22%">Name</TableColumn>
        <TableColumn width="19%">Email</TableColumn>
        <TableColumn width="15%">Latest Login</TableColumn>
        <TableColumn width="10%">Logins</TableColumn>
        <TableColumn width="17%">Connection</TableColumn>
        <TableColumn width="15%"></TableColumn>
      </TableHeader>
      <TableBody>
      {users.map((user, index) => {
        return (
            <TableRow key={index}>
              <TableCell>
                <img className="img-circle" src={ user.picture } alt={ user.name || user.email || user.user_id } width="32" />
              </TableCell>
              <TableRouteCell route={`/users/${user.user_id}`}>{ user.name || user.email || user.user_id }</TableRouteCell>
              <TableTextCell>{ user.email || 'N/A' }</TableTextCell>
              <TableTextCell>{ user.last_login_relative }</TableTextCell>
              <TableTextCell>{ user.logins_count }</TableTextCell>
              <TableTextCell>{ user.identities[0].connection }</TableTextCell>
              <TableCell>
                <ButtonToolbar style={{ marginBottom: '0px' }}>
                  {this.getMultifactorAction(user, index)}
                  {this.getBlockedAction(user, index)}
                </ButtonToolbar>
              </TableCell>
            </TableRow>
          );
      })}
      </TableBody>
    </Table>;
  }
}

UsersTable.propTypes = {
  users: React.PropTypes.array.isRequired,
  loading: React.PropTypes.bool.isRequired,
  removeMultiFactor: React.PropTypes.func.isRequired,
  blockUser: React.PropTypes.func.isRequired,
  unblockUser: React.PropTypes.func.isRequired
};

export default UsersTable;
