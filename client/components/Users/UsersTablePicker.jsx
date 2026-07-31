import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar } from 'react-bootstrap';

import { TableActionCell, Table, TableCell, TableRouteCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow, TableAction } from '@a0/auth0-extension-ui';

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
        <TableBody />
      </Table>
    );
  }
}

UsersTablePicker.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default UsersTablePicker;
