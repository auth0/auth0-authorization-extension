import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import { InputText, InputCombo, LoadingPanel } from '../Dashboard';

class PermissionForm extends Component {
  render() {
    const { fields: { name, description, client_id }, handleSubmit, loading, submitting, validationErrors } = this.props;

    const applications = this.props.applications.map(app => {
      return {
        value: app.client_id,
        text: app.name
      };
    });

    return <div>
      <Modal.Body>
        {this.props.children}
        <LoadingPanel show={ loading } spinnerStyle={{ height: '16px', width: '16px' }}
            animationStyle={{ paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '10px' }}>
          <InputText field={name} fieldName="name" label="Name" validationErrors={validationErrors} />
          <InputText field={description} fieldName="description" label="Description" validationErrors={validationErrors} />
          <InputCombo options={applications} field={client_id} fieldName="client_id" label="Application (client_id)" validationErrors={validationErrors} />
        </LoadingPanel>
      </Modal.Body>
      <Modal.Footer>
        <ButtonToolbar>
          <Button bsSize="small" disabled={ loading || submitting } onClick={this.props.onClose}>
            <i className="icon icon-budicon-501"></i> Cancel
          </Button>
          <Button bsStyle="primary" bsSize="small" disabled={ loading || submitting } onClick={handleSubmit}>
            <i className="icon icon-budicon-245"></i> Save
          </Button>
        </ButtonToolbar>
      </Modal.Footer>
    </div>;
  }
}

PermissionForm.propTypes = {
  applications: React.PropTypes.array,
  validationErrors: React.PropTypes.object,
  loading: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired
};

PermissionForm = reduxForm({ form: 'permission', fields: [ 'name', 'description', 'client_id' ] })(PermissionForm);
export default PermissionForm;
