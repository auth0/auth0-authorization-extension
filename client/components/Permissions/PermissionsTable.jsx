import _ from 'lodash';
import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Table, TableCell, TableAction, TableIconCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class PermissionsTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.permissions !== this.props.permissions || nextProps.applications !== this.props.applications;
  }

  render() {
    const applications = this.props.applications.toJS();
    const permissions = this.props.permissions.toJS().map(perm => {
      const application = _.find(applications, { client_id: perm.client_id });
      perm.client_name = application && application.name || perm.client_id || 'N/A';
      return perm;
    });

    return <Table>
      <TableHeader>
        <TableColumn width="3%"></TableColumn>
        <TableColumn width="18%">Name</TableColumn>
        <TableColumn width="33%">Description</TableColumn>
        <TableColumn width="30%">Application</TableColumn>
        <TableColumn width="15%"></TableColumn>
      </TableHeader>
      <TableBody>
        {_.sortBy(permissions, 'client_name').map((permission, index) => {
          return <TableRow key={index}>
              <TableIconCell icon="384" />
              <TableTextCell>{ permission.name || 'N/A' }</TableTextCell>
              <TableTextCell>{ permission.description || 'N/A' }</TableTextCell>
              <TableTextCell>{ permission.client_name }</TableTextCell>
              <TableCell>
                <ButtonToolbar style={{ marginBottom: '0px' }}>
                  <TableAction id={`edit-${index}`} type="default" title="Edit Permission" icon="266"
                    onClick={() => this.props.onEdit(permission)} disabled={this.props.loading || false} />
                  <TableAction id={`delete-${index}`} type="success" title="Delete Permission" icon="263"
                    onClick={() => this.props.onDelete(permission)} disabled={this.props.loading || false} />
                </ButtonToolbar>
              </TableCell>
            </TableRow>;
        })
      }
      </TableBody>
    </Table>;
  }
}

PermissionsTable.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  applications: React.PropTypes.object.isRequired,
  permissions: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default PermissionsTable;
