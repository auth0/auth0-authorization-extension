import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

import { Error } from 'auth0-extension-ui';
import GroupMappingForm from './GroupMappingForm';

class GroupMappingDialog extends Component {
  constructor() {
    super();
    this.onSave = this.onSave.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group || nextProps.groupMapping !== this.props.groupMapping || nextProps.connections !== this.props.connections;
  }

  onSave(groupMapping) {
    const groupReducer = this.props.group.toJS();

    this.props.onSave(groupReducer.record, groupMapping);
  }

  render() {
    const mapping = this.props.groupMapping.toJS();
    const connections = this.props.connections.toJS();

    const title = mapping.isNew ? 'New Mapping' : `Edit Mapping: ${mapping.record.groupName}`;
    const isVisible = mapping.isEdit || mapping.isNew;

    return (
      <Modal show={isVisible} onHide={this.props.onClose}>
        <Modal.Header closeButton={!mapping.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <GroupMappingForm
          loading={mapping.loading}
          connections={connections.records}
          initialValues={mapping.record}
          validationErrors={mapping.validationErrors}
          onClose={this.props.onClose}
          onSubmit={this.onSave}
        >
          <Error message={mapping.error} />
        </GroupMappingForm>
      </Modal>
    );
  }
}

GroupMappingDialog.propTypes = {
  onSave: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  group: React.PropTypes.object.isRequired,
  groupMapping: React.PropTypes.object.isRequired,
  connections: React.PropTypes.object.isRequired
};

export default GroupMappingDialog;
