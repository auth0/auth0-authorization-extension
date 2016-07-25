import _ from 'lodash';
import React, { PropTypes, Component } from 'react';

import PermissionRow from './PermissionRow';
import { Table, TableBody, TableHeader, TableColumn } from '../Dashboard';

export default class PermissionTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    permissions: PropTypes.object.isRequired,
    renderActions: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.permissions !== this.props.permissions;
  }

  render() {
    console.log(this.props);
    const permissions = this.props.permissions.toJS();

    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="15%">Name</TableColumn>
          <TableColumn width="28%">Description</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody>
          {_.sortBy(permissions, 'name').map((permission, index) =>
            <PermissionRow key={index} index={index} permission={permission} renderActions={this.props.renderActions} />
          )}
        </TableBody>
      </Table>
    );
  }
}
