import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';

import { TableActionCell, Table, TableCell, TableRouteCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class UsersTable extends Component {
  constructor() {
    super();
    this.renderActions = this.renderActions.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.users !== this.props.users;
  }

  renderActions(user, index) {
    return this.props.renderActions(user, index);
  }

  render() {
    const { users } = this.props;
    return (
      <Table>
        <TableHeader>
          <TableColumn width="6%" />
          <TableColumn width="22%">Name</TableColumn>
          <TableColumn width="29%">Email</TableColumn>
          <TableColumn width="15%">Latest Login</TableColumn>
          <TableColumn width="10%">Logins</TableColumn>
          <TableColumn width="17%">Connection</TableColumn>
          <TableColumn width="15%" />
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
                <TableActionCell>
                  {this.renderActions(user, index)}
                </TableActionCell>
              </TableRow>
            );
        })}
        </TableBody>
      </Table>
    );
  }
}

UsersTable.propTypes = {
  users: React.PropTypes.array.isRequired,
  loading: React.PropTypes.bool.isRequired,
  renderActions: React.PropTypes.func.isRequired
};

export default UsersTable;
