import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';

import { InputText, InputCombo, LoadingPanel } from 'auth0-extension-ui';
import createForm from '../../utils/createForm';

export default createForm('groupMapping', class GroupMappingForm extends Component {
  propTypes = {
    children: React.PropTypes.object,
    fields: React.PropTypes.object,
    connections: React.PropTypes.array,
    validationErrors: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    submitting: React.PropTypes.bool,
    handleSubmit: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
  };

  render() {
    const { handleSubmit, loading, submitting, validationErrors } = this.props;

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
              When users log in with the selected connection and belong to the selected group then they will also become an implicit member of this groupi.
            </p>

            <form className="form-horizontal">
              <Field
                name="connectionName" component={InputCombo}
                options={connections} label="Connection"
                validationErrors={validationErrors}
              />

              <Field
                name="groupName" component={InputText} label="Incoming Group Name"
                validationErrors={validationErrors}
              />
            </form>
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
});
