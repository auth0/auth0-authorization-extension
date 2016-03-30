import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';

import { TableCell, TableIconCell, TableRouteCell, TableTextCell, TableRow } from '../Dashboard';

class GroupRow extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group;
  }

  renderGroupName(group) {
    if (this.props.canOpenGroup) {
      return <TableRouteCell route={`/groups/${group._id}`}>{ group.name || 'N/A' }</TableRouteCell>;
    }

    return <TableTextCell>{ group.name || 'N/A' }</TableTextCell>;
  }

  render() {
    const { group, index } = this.props;

    return (
      <TableRow>
        <TableIconCell icon="322" />
        {this.renderGroupName(group)}
        <TableTextCell>{ group.description || 'N/A' }</TableTextCell>
        <TableTextCell>{ (group.members && group.members.length) || '0' }</TableTextCell>
        <TableTextCell>{ (group.nested && group.nested.length) || '0' }</TableTextCell>
        <TableTextCell>{ (group.mappings && group.mappings.length) || '0' }</TableTextCell>
        <TableCell>
          <ButtonToolbar style={{ marginBottom: '0px' }}>
            {this.props.renderActions(group, index)}
          </ButtonToolbar>
        </TableCell>
      </TableRow>
    );
  }
}

GroupRow.propTypes = {
  loading: React.PropTypes.bool,
  index: React.PropTypes.number.isRequired,
  canOpenGroup: React.PropTypes.bool,
  group: React.PropTypes.object.isRequired,
  renderActions: React.PropTypes.func.isRequired
};

export default GroupRow;
