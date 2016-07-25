import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

import { Error } from '../Dashboard';
import PermissionForm from './PermissionForm';

export default class PermissionDialog extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    permission: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.permission !== this.props.permission || nextProps.applications !== this.props.applications;
  }

  render() {
    const permission = this.props.permission.toJS();
    const title = permission.isNew ? 'New Permission' : `Edit Permission: ${permission.record.name}`;
    const isVisible = permission.isEdit || permission.isNew;

    return (
      <Modal show={isVisible} onHide={this.props.onClose}>
        <Modal.Header closeButton={!permission.loading}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <PermissionForm loading={permission.loading} initialValues={permission.record} validationErrors={permission.validationErrors}
            onClose={this.props.onClose} onSubmit={(perm) => this.props.onSave(perm)}>
          <Error message={permission.error} />
        </PermissionForm>
      </Modal>
    );
  }
}
