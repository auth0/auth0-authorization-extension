import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

import { Error } from '../Dashboard';
import PermissionForm from './PermissionForm';

class PermissionDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.permission !== this.props.permission || nextProps.applications !== this.props.applications;
  }

  render() {
    const permission = this.props.permission.toJS();
    const applications = this.props.applications.toJS();

    const title = permission.isNew ? 'New Permission' : `Edit Permission: ${permission.record.name}`;
    const isVisible = permission.isEdit || permission.isNew;

    return <Modal show={isVisible} onHide={this.props.onClose}>
      <Modal.Header closeButton={!permission.loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <PermissionForm loading={permission.loading} applications={applications} initialValues={permission.record} validationErrors={permission.validationErrors}
          onClose={this.props.onClose} onSubmit={(perm) => this.props.onSave(perm)}>
          <Error message={permission.error} />
      </PermissionForm>
    </Modal>;
  }
}

PermissionDialog.propTypes = {
  onSave: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  permission: React.PropTypes.object.isRequired
};

export default PermissionDialog;
