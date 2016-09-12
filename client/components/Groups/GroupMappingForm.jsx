import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import { InputText, InputCombo, LoadingPanel } from '../Dashboard';

class GroupMappingForm extends Component {
  render() {
    const { fields: { connectionName, groupName }, handleSubmit, loading, submitting, validationErrors } = this.props;

    const connections = this.props.connections.map(connection => ({
      value: connection.name,
      text: `${connection.name} (${connection.strategy})`
    }));

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <LoadingPanel show={loading} spinnerStyle={{ height: '16px', width: '16px' }} animationStyle={{ paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '10px' }}>
            <p className="modal-description">
              When creating a mapping if users log in with the selected connection and belongs
              to the specified Incomming group then they will be part of this group also.
            </p>
            <InputCombo options={connections} field={connectionName} fieldName="connectionName" label="Connection" validationErrors={validationErrors} />
            <InputText field={groupName} fieldName="groupName" label="Incoming Group Name" validationErrors={validationErrors} />
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading || submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsStyle="primary" disabled={loading || submitting} onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </div>
    );
  }
}

GroupMappingForm.propTypes = {
  children: React.PropTypes.object,
  fields: React.PropTypes.object,
  connections: React.PropTypes.array,
  validationErrors: React.PropTypes.object,
  loading: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default reduxForm({ form: 'groupMapping', fields: [ 'connectionName', 'groupName' ] })(GroupMappingForm);
