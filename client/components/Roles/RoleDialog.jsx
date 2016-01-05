import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

import { Error } from '../Dashboard';
import RoleForm from './RoleForm';

class RoleDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.role !== this.props.role || nextProps.applications !== this.props.applications;
  }

  render() {
    const role = this.props.role.toJS();

    const title = role.isNew ? 'New Role' : `Edit Role: ${role.record.name}`;
    const isVisible = role.isEdit || role.isNew;

    return <Modal show={isVisible} onHide={this.props.onClose}>
      <Modal.Header closeButton={!role.loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <RoleForm loading={role.loading} initialValues={role.record} validationErrors={role.validationErrors}
          onClose={this.props.onClose} onSubmit={(perm) => this.props.onSave(perm)}>
          <Error message={role.error} />
      </RoleForm>
    </Modal>;
  }
}

RoleDialog.propTypes = {
  onSave: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  role: React.PropTypes.object.isRequired
};

export default RoleDialog;
