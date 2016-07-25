import _ from 'lodash';
import React, { PropTypes, Component } from 'react';

import RoleRow from './RoleRow';
import { Table, TableBody, TableHeader, TableColumn } from '../Dashboard';

export default class RoleTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    roles: PropTypes.object.isRequired,
    renderActions: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.roles !== this.props.roles;
  }

  render() {
    const roles = this.props.roles.toJS();

    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="15%">Name</TableColumn>
          <TableColumn width="28%">Description</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody>
          {_.sortBy(roles, 'name').map((role, index) =>
            <RoleRow key={index} index={index} role={role} renderActions={this.props.renderActions} />
          )}
        </TableBody>
      </Table>
    );
  }
}
