import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import createForm from '../../utils/createForm';
import { InputText, InputCombo, LoadingPanel, ScopeGroup } from '../Dashboard';

export default createForm('role', class extends Component {
  static propTypes = {
    validationErrors: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    permissions: PropTypes.array.isRequired,
    applications: PropTypes.array.isRequired,
    isNew: PropTypes.bool.isRequired
  };

  static formFields = [
    'name',
    'description',
    'applicationId',
    'permissions'
  ];

  state = {
    isNew: false,
    mode: 'edit-role',
    applications: [],
    permissions: []
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isNew) {
      return;
    }

    const { applicationId } = (nextProps.initialValues || nextProps.values);

    this.setState({
      isNew: nextProps.isNew,
      mode: nextProps.isNew ? 'select-app' : 'edit-role',
      applications: nextProps.applications.map(app => ({
        value: app.client_id,
        text: `${app.name}`
      })),
      permissions: nextProps.permissions
        .filter(perm => perm.applicationId === applicationId)
        .map(perm => ({
          value: perm._id,
          text: perm.name
        }))
    });
  }

  onBack = () => {
    this.setState({
      mode: 'select-app'
    });
  }

  onNext = () => {
    this.setState({
      mode: 'edit-role'
    });
  }

  getFields(name, description, permissions, applicationId, validationErrors) {
    if (this.state.mode === 'select-app') {
      return (
        <div>
          <InputCombo options={this.state.applications} field={applicationId} fieldName="applicationId" label="Application"
            validationErrors={validationErrors}
          />
        </div>
      );
    }

    return (
      <div>
        <InputText field={name} fieldName="name" label="Name"
          validationErrors={validationErrors}
        />
        <InputText field={description} fieldName="description" label="Description"
          validationErrors={validationErrors}
        />
        <InputCombo options={this.state.applications} field={applicationId} fieldName="applicationId" label="Application"
          validationErrors={validationErrors} readOnly
        />
      <ScopeGroup options={this.state.permissions} field={permissions} fieldName="permissions" />
      </div>
    );
  }

  getActionButton(loading, submitting, handleSubmit) {
    if (this.state.mode === 'edit-role') {
      return (
        <Button bsStyle="primary" bsSize="small" disabled={ loading || submitting } onClick={handleSubmit}>
          <i className="icon icon-budicon-245"></i> Save
        </Button>
      );
    }

    return (
      <Button bsStyle="primary" bsSize="small" disabled={ loading || submitting } onClick={this.onNext}>
        <i className="icon icon-budicon-245"></i> Next
      </Button>
    );
  }

  render() {
    const { fields: { name, description, permissions, applicationId }, mode, handleSubmit, loading, submitting, validationErrors } = this.props;

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <LoadingPanel show={loading}>
            {this.getFields(name, description, permissions, applicationId, validationErrors)}
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" disabled={ loading || submitting } onClick={this.props.onClose}>
            <i className="icon icon-budicon-501"></i> Cancel
          </Button>
          {this.getActionButton(loading, submitting, handleSubmit)}
        </Modal.Footer>
      </div>
    );
  }
});
