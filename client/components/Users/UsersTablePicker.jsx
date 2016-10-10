import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';

import { TableActionCell, Table, TableCell, TableRouteCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow, TableAction } from '../Dashboard';

class UsersTablePicker extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.users !== this.props.users;
  }

  render() {
    const { users } = this.props;
    return (
      <Table>
        <TableHeader>
          <TableColumn width="6%" />
          <TableColumn width="30%">Name</TableColumn>
          <TableColumn width="29%">Email</TableColumn>
        </TableHeader>
        <TableBody>
        </TableBody>
      </Table>
    );
  }
}

UsersTablePicker.propTypes = {
  users: React.PropTypes.array.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default UsersTablePicker;
