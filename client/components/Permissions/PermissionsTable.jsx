import _ from 'lodash';
import React, { PropTypes, Component } from 'react';

import PermissionRow from './PermissionRow';
import { Table, TableBody, TableHeader, TableColumn } from '../Dashboard';

export default class PermissionTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    permissions: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    renderActions: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.permissions !== this.props.permissions || nextProps.applications !== this.props.applications;
  }

  render() {
    const permissions = this.props.permissions.toJS();
    const applications = this.props.applications.toJS().records;

    return (
      <Table>
        <TableHeader>
          <TableColumn width="30%">Name</TableColumn>
          <TableColumn width="26%">Application</TableColumn>
          <TableColumn width="32%">Description</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody>
          {_.sortBy(permissions, 'name').map((permission, index) => {
            const application = applications.find(app => app.client_id === permission.applicationId);
            return (
              <PermissionRow
                key={index} index={index} application={application} permission={permission}
                renderActions={this.props.renderActions}
              />
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
