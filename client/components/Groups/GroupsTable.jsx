import _ from 'lodash';
import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Table, TableCell, TableAction, TableIconCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class GroupsTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.groups !== this.props.groups || nextProps.applications !== this.props.applications;
  }

  render() {
    const groups = this.props.groups.toJS();

    return <Table>
      <TableHeader>
        <TableColumn width="3%"></TableColumn>
        <TableColumn width="27%">Name</TableColumn>
        <TableColumn width="55%">Description</TableColumn>
        <TableColumn width="15%"></TableColumn>
      </TableHeader>
      <TableBody>
        {_.sortBy(groups, 'name').map((group, index) => {
          return <TableRow key={index}>
              <TableIconCell icon="322" />
              <TableTextCell>{ group.name || 'N/A' }</TableTextCell>
              <TableTextCell>{ group.description || 'N/A' }</TableTextCell>
              <TableCell>
                <ButtonToolbar style={{ marginBottom: '0px' }}>
                  <TableAction id={`edit-${index}`} type="default" title="Edit Group" icon="266"
                    onClick={() => this.props.onEdit(group)} disabled={this.props.loading || false} />
                  <TableAction id={`delete-${index}`} type="success" title="Delete Group" icon="263"
                    onClick={() => this.props.onDelete(group)} disabled={this.props.loading || false} />
                </ButtonToolbar>
              </TableCell>
            </TableRow>;
        })
      }
      </TableBody>
    </Table>;
  }
}

GroupsTable.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  groups: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default GroupsTable;
