import React, { Component } from 'react';
import { Error, Confirm } from '../Dashboard';

class DeletePermissionDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.permission !== this.props.permission;
  }

  render() {
    const permission = this.props.permission.toJS();
    return (
      <Confirm title="Delete Permission?" show={permission.requesting && permission.isDelete} loading={permission.loading} onCancel={this.props.onCancel} onConfirm={this.props.onConfirm}>
        <Error message={permission.error} />
        <p>Do you really want to delete <strong>{permission.permissionId}</strong>? This means the permission will also be removed from any possible role.</p>
      </Confirm>
    );
  }
}

DeletePermissionDialog.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  permission: React.PropTypes.object.isRequired
};

export default DeletePermissionDialog;
