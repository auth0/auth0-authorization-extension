import _ from 'lodash';
import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Table, TableCell, TableAction, TableIconCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class RolesTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.roles !== this.props.roles || nextProps.applications !== this.props.applications;
  }

  render() {
    const roles = this.props.roles.toJS();

    return <Table>
      <TableHeader>
        <TableColumn width="3%"></TableColumn>
        <TableColumn width="27%">Name</TableColumn>
        <TableColumn width="55%">Description</TableColumn>
        <TableColumn width="15%"></TableColumn>
      </TableHeader>
      <TableBody>
        {_.sortBy(roles, 'name').map((role, index) => {
          return <TableRow key={index}>
              <TableIconCell icon="549" />
              <TableTextCell>{ role.name || 'N/A' }</TableTextCell>
              <TableTextCell>{ role.description || 'N/A' }</TableTextCell>
              <TableCell>
                <ButtonToolbar style={{ marginBottom: '0px' }}>
                  <TableAction id={`edit-${index}`} type="default" title="Edit Role" icon="266"
                    onClick={() => this.props.onEdit(role)} disabled={this.props.loading || false} />
                  <TableAction id={`delete-${index}`} type="success" title="Delete Role" icon="263"
                    onClick={() => this.props.onDelete(role)} disabled={this.props.loading || false} />
                </ButtonToolbar>
              </TableCell>
            </TableRow>;
        })
      }
      </TableBody>
    </Table>;
  }
}

RolesTable.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  roles: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default RolesTable;
