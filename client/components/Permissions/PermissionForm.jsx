import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import createForm from '../../utils/createForm';
import { InputText, InputCombo, LoadingPanel } from '../Dashboard';

export default createForm('permission', class extends Component {
  static propTypes = {
    validationErrors: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    applications: PropTypes.object.isRequired
  };

  static formFields = [
    'name',
    'description',
    'applicationId'
  ];

  render() {
    const { fields: { name, description, applicationId }, handleSubmit, loading, submitting, validationErrors } = this.props;
    const applications = this.props.applications.map(app => ({
      value: app.client_id,
      text: `${app.name}`
    }));

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <LoadingPanel show={loading}>
            <InputText
              field={name} fieldName="name" label="Name"
              validationErrors={validationErrors}
            />
            <InputText
              field={description} fieldName="description" label="Description"
              validationErrors={validationErrors}
            />
            <InputCombo
              options={applications} field={applicationId} fieldName="applicationId" label="Application"
              validationErrors={validationErrors}
            />
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" disabled={loading || submitting} onClick={this.props.onClose}> Cancel </Button>
          <Button bsStyle="primary" bsSize="small" disabled={loading || submitting} onClick={handleSubmit}> Save </Button>
        </Modal.Footer>
      </div>
    );
  }
});
