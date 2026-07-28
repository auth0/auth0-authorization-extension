import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';

import { InputText, InputCombo, LoadingPanel } from '@a0/auth0-extension-ui';
import createForm from '../../utils/createForm';

export default createForm('groupMapping', class GroupMappingForm extends Component {
  propTypes = {
    children: PropTypes.object,
    fields: PropTypes.object,
    connections: PropTypes.array,
    validationErrors: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
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
          <Button variant="primary" disabled={loading || submitting} onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </div>
    );
  }
});
