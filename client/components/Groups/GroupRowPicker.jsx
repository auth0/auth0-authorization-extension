import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TableCell, TableRouteCell, TableTextCell, TableRow } from '@a0/auth0-extension-ui';

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
    const { group } = this.props;

    return (
      <TableRow>
        <TableCell>
          <input type="checkbox" name="nested-groups" value={group._id} onChange={this.props.setNested} />
        </TableCell>
        {this.renderGroupName(group)}
        <TableTextCell>{ group.description || 'N/A' }</TableTextCell>
      </TableRow>
    );
  }
}

GroupRowPicker.propTypes = {
  loading: PropTypes.bool,
  index: PropTypes.number.isRequired,
  canOpenGroup: PropTypes.bool,
  group: PropTypes.object.isRequired,
  setNested: PropTypes.func.isRequired
};

export default GroupRowPicker;
