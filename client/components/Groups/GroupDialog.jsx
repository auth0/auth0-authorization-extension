import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import { Error } from '@a0/auth0-extension-ui';
import GroupForm from './GroupForm';

class GroupDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group || nextProps.applications !== this.props.applications;
  }

  render() {
    const group = this.props.group.toJS();
    const title = group.isNew ? 'Create Group' : `Edit Group: ${group.record.name}`;
    const isVisible = group.isEdit || group.isNew;

    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.props.onClose}>
        <Modal.Header closeButton={!group.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <GroupForm
          loading={group.loading}
          initialValues={group.record}
          validationErrors={group.validationErrors}
          onClose={this.props.onClose}
          onSubmit={(perm) => this.props.onSave(perm)}
          isNew={group.isNew}
        >
          <Error message={group.error} />
        </GroupForm>
      </Modal>
    );
  }
}

GroupDialog.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  applications: PropTypes.array.isRequired
};

export default GroupDialog;
