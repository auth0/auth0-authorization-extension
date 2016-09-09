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
    applications: PropTypes.object.isRequired,
    children: PropTypes.node
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
            <p className="modal-description">Select the application of this permission and give it a name and a  description (optional).</p>
            <InputText
              field={name} fieldName="name" label="Name"
              validationErrors={validationErrors} placeholder="e.g. read:invoce, delete:user, edit:book"
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
          <Button bsSize="large" disabled={loading || submitting} onClick={this.props.onClose}> Cancel </Button>
          <Button bsStyle="primary" bsSize="large" disabled={loading || submitting} onClick={handleSubmit}> Create </Button>
        </Modal.Footer>
      </div>
    );
  }
});
