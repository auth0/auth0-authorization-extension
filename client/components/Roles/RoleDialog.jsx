import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

import { Error } from 'auth0-extension-ui';
import RoleForm from './RoleForm';

export default class RoleDialog extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    role: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    onApplicationSelected: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.role !== this.props.role || nextProps.applications !== this.props.applications || nextProps.permissions !== this.props.permissions;
  }

  render() {
    const applications = this.props.applications.toJS();
    const permissions = this.props.permissions.toJS();
    const role = this.props.role.toJS();
    const title = role.isNew ? 'Create Role' : `Edit Role: ${role.record.name}`;
    const isVisible = role.isEdit || role.isNew;

    return (
      <Modal show={isVisible} onHide={this.props.onClose}>
        <Modal.Header closeButton={!role.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <RoleForm
          isNew={role.isNew} applications={applications.records} permissions={permissions.records} loading={role.loading} initialValues={role.record} validationErrors={role.validationErrors}
          onClose={this.props.onClose} onSubmit={this.props.onSave}
          page={role.page}
          onApplicationSelected={this.props.onApplicationSelected}
        >
          <Error message={role.error} />
        </RoleForm>
      </Modal>
    );
  }
}
