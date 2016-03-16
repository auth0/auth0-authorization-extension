import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

import { Error } from '../Dashboard';
import GroupMappingForm from './GroupMappingForm';

class GroupMappingDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.mapping !== this.props.mapping || nextProps.connections !== this.props.connections;
  }

  render() {
    const mapping = this.props.mapping.toJS();
    const connections = this.props.connections.toJS();

    const title = mapping.isNew ? 'New Mapping' : `Edit Mapping: ${mapping.record.groupName}`;
    const isVisible = mapping.isEdit || mapping.isNew;

    return (
      <Modal show={isVisible} onHide={this.props.onClose}>
        <Modal.Header closeButton={!mapping.loading}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <GroupMappingForm loading={mapping.loading} connections={connections} initialValues={mapping.record} validationErrors={mapping.validationErrors}
          onClose={this.props.onClose} onSubmit={this.props.onSave}>
            <Error message={mapping.error} />
        </GroupMappingForm>
      </Modal>
    );
  }
}

GroupMappingDialog.propTypes = {
  onSave: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  mapping: React.PropTypes.object.isRequired,
  connections: React.PropTypes.object.isRequired
};

export default GroupMappingDialog;
