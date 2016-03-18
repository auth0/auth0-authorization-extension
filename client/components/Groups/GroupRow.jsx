import React, { Component } from 'react';
import { Modal, ButtonToolbar } from 'react-bootstrap';

import { TableCell, TableAction, TableIconCell, TableRouteCell, TableTextCell, TableRow } from '../Dashboard';

class GroupRow extends Component {
  constructor() {
    super();
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group;
  }

  edit() {
    this.props.onEdit(this.props.group);
  }

  delete() {
    this.props.onDelete(this.props.group);
  }

  render() {
    const { group } = this.props;
console.log(group);
    return (
      <TableRow>
        <TableIconCell icon="322" />
        <TableRouteCell route={`/groups/${group._id}`}>{ group.name || 'N/A' }</TableRouteCell>
        <TableTextCell>{ group.description || 'N/A' }</TableTextCell>
        <TableTextCell>{ group.members.length || '0' }</TableTextCell>
        <TableTextCell>{ group.mappings.length || '0' }</TableTextCell>
        <TableCell>
          <ButtonToolbar style={{ marginBottom: '0px' }}>
            <TableAction id={`edit-${group._id}`} type="default" title="Edit Group" icon="266"
              onClick={this.edit} disabled={this.props.loading || false} />
            <TableAction id={`delete-${group._id}`} type="success" title="Delete Group" icon="263"
              onClick={this.delete} disabled={this.props.loading || false} />
          </ButtonToolbar>
        </TableCell>
      </TableRow>
    );
  }
}

GroupRow.propTypes = {
  group: React.PropTypes.object.isRequired,
  onEdit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired
};

export default GroupRow;
