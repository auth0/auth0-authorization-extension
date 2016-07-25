import React, { PropTypes, Component } from 'react';

import { TableCell, TableIconCell, TableTextCell, TableRow } from '../Dashboard';

export default class PermissionRow extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    index: PropTypes.number.isRequired,
    permission: PropTypes.object.isRequired,
    renderActions: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.permission !== this.props.permission;
  }

  render() {
    const { permission, index } = this.props;

    return (
      <TableRow>
        <TableIconCell icon="322" />
        <TableTextCell>{ permission.name || 'N/A' }</TableTextCell>
        <TableTextCell>{ permission.description || 'N/A' }</TableTextCell>
        <TableCell>
          {this.props.renderActions(permission, index)}
        </TableCell>
      </TableRow>
    );
  }
}
