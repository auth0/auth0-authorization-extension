import React, { PropTypes, Component } from 'react';

import { TableCell, TableIconCell, TableTextCell, TableRow } from 'auth0-extension-ui';

export default class RoleRow extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    index: PropTypes.number.isRequired,
    application: PropTypes.object,
    role: PropTypes.object.isRequired,
    renderActions: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.role !== this.props.role;
  }

  render() {
    const { application, role, index } = this.props;

    return (
      <TableRow>
        <TableTextCell>{ role.name || 'N/A' }</TableTextCell>
        <TableTextCell>{ application ? application.name : role.applicationId }</TableTextCell>
        <TableTextCell>{ role.description || 'N/A' }</TableTextCell>
        <TableCell style={{ paddingRight: 0, textAlign: 'right' }}>
          {this.props.renderActions(role, index)}
        </TableCell>
      </TableRow>
    );
  }
}
