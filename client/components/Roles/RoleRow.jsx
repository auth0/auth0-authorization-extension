import React, { PropTypes, Component } from 'react';

import { TableCell, TableIconCell, TableTextCell, TableRow } from 'auth0-extension-ui';

export default class RoleRow extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    index: PropTypes.number.isRequired,
    application: PropTypes.object,
    role: PropTypes.object.isRequired,
    renderActions: PropTypes.func.isRequired,
    showIcon: PropTypes.bool
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.role !== this.props.role;
  }

  render() {
    const { application, role, index } = this.props;
    const showIcon = this.props.showIcon;

    return (
      <TableRow>
        { showIcon ? <TableIconCell color="green" icon="322" /> : null }
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
