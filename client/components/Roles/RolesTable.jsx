import _ from 'lodash';
import React, { PropTypes, Component } from 'react';
import { Table, TableBody, TableHeader, TableColumn } from 'auth0-extension-ui';

import RoleRow from './RoleRow';

export default class RoleTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    roles: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    renderActions: PropTypes.func.isRequired,
    showIcon: PropTypes.bool
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.roles !== this.props.roles || nextProps.applications !== this.props.applications;
  }

  render() {
    const roles = this.props.roles.toJS();
    const applications = this.props.applications.toJS().records;
    const showIcon = this.props.showIcon;

    return (
      <Table>
        <TableHeader>
          { showIcon ? <TableColumn width="3%" /> : null }
          <TableColumn width="30%">Name</TableColumn>
          <TableColumn width="30%">Application</TableColumn>
          { showIcon ? <TableColumn width="25%">Description</TableColumn> : <TableColumn width="28%">Description</TableColumn> }
          <TableColumn />
        </TableHeader>
        <TableBody>
          {_.sortBy(roles, 'name').map((role, index) => {
            const application = applications.find(app => app.client_id === role.applicationId);
            return (
              <RoleRow
                showIcon={showIcon}
                key={index}
                index={index}
                application={application}
                role={role}
                renderActions={this.props.renderActions}
              />
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
