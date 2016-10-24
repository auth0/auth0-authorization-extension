import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';

import { TableCell, TableIconCell, TableRouteCell, TableTextCell, TableRow } from 'auth0-extension-ui';

class GroupRowPicker extends Component {
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
        <TableCell>
          <input type="checkbox" name="nested-groups" value="all" />
        </TableCell>
        {this.renderGroupName(group)}
        <TableTextCell>{ group.description || 'N/A' }</TableTextCell>
      </TableRow>
    );
  }
}

GroupRowPicker.propTypes = {
  loading: React.PropTypes.bool,
  index: React.PropTypes.number.isRequired,
  canOpenGroup: React.PropTypes.bool,
  group: React.PropTypes.object.isRequired
};

export default GroupRowPicker;
