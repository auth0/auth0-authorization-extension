import React, { Component } from 'react';
import { Error, Confirm } from '../Dashboard';

class DeleteRoleDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.role !== this.props.role;
  }

  render() {
    const role = this.props.role.toJS();
    return (
      <Confirm title="Delete Role?" show={role.requesting && role.isDelete} loading={role.loading} onCancel={this.props.onCancel} onConfirm={this.props.onConfirm}>
        <Error message={role.error} />
        <p>Do you really want to delete <strong>{role.roleId}</strong>? This means the role will also be removed from any possible role.</p>
      </Confirm>
    );
  }
}

DeleteRoleDialog.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  role: React.PropTypes.object.isRequired
};

export default DeleteRoleDialog;
