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
          <LoadingPanel show={ loading } spinnerStyle={{ height: '16px', width: '16px' }} animationStyle={{ paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '10px' }}>
            <InputCombo options={connections} field={connectionName} fieldName="connectionName" label="Connection" validationErrors={validationErrors} />
            <InputText field={groupName} fieldName="groupName" label="Incoming Group Name" validationErrors={validationErrors} />
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" disabled={ loading || submitting } onClick={this.props.onClose}>
            <i className="icon icon-budicon-501"></i> Cancel
          </Button>
          <Button bsStyle="primary" bsSize="small" disabled={ loading || submitting } onClick={handleSubmit}>
            <i className="icon icon-budicon-245"></i> Save
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
