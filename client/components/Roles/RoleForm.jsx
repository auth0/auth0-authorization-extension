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
    isNew: PropTypes.bool.isRequired,
    onApplicationSelected: PropTypes.func.isRequired
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

  constructor(props) {
    super(props);

    this.state = {
      applicationId: props.applicationId
    };
  }

  componentWillReceiveProps(nextProps) {
    const { applicationId } = (nextProps.initialValues || nextProps.values);

    this.setState({
      applicationId,
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
    this.props.onApplicationSelected('');
  }

  onNext = () => {
    if (this.props.onApplicationSelected) {
      this.props.onApplicationSelected(this.state.applicationId);
    }
  }

  onApplicationChanged = (e) => {
    this.setState({
      applicationId: e.target.value
    });
  }

  getFields(name, description, permissions, applicationId, validationErrors) {
    if (this.props.page === 'chooseApplication') {
      return (
        <div>
          <p className="modal-description">
            Give a name, description (optional) and permissions for this role.
          </p>
          <InputCombo
            options={this.state.applications} field={applicationId} fieldName="applicationId" label="Application"
            validationErrors={validationErrors} onChange={this.onApplicationChanged}
          />
        </div>
      );
    }

    // editRole
    return (
      <div>
        <p className="modal-description">
          Select the application you want to create the role for.
        </p>
        <InputCombo
          options={this.state.applications} field={applicationId} fieldName="applicationId" label="Application"
          validationErrors={validationErrors} disabled
        />
        <InputText
          field={name} fieldName="name" label="Name"
          validationErrors={validationErrors}
        />
        <InputText
          field={description} fieldName="description" label="Description"
          validationErrors={validationErrors}
        />
        <ScopeGroup options={this.state.permissions} field={permissions} fieldName="permissions" label="Permissions" />
      </div>
    );
  }

  getCancelButton(loading, submitting) {
    if (this.props.isNew && this.props.page === 'editRole') {
      return (
        <Button bsSize="large" disabled={loading || submitting} onClick={this.onBack}>Back</Button>
      );
    }

    return (
      <Button bsSize="large" disabled={loading || submitting} onClick={this.props.onClose}>Cancel</Button>
    );
  }

  getActionButton(loading, submitting, handleSubmit, applicationId) {
    if (this.props.page === 'editRole') {
      return (
        <Button bsStyle="primary" bsSize="large" disabled={loading || submitting} onClick={handleSubmit}>
          Save
        </Button>
      );
    }

    return (
      <Button bsStyle="primary" bsSize="large" disabled={!this.state.applicationId || this.state.applicationId === ''} onClick={this.onNext}>
        Next
      </Button>
    );
  }

  render() {
    const { fields: { name, description, permissions, applicationId }, handleSubmit, loading, submitting, validationErrors } = this.props;

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <LoadingPanel show={loading}>
            {this.getFields(name, description, permissions, applicationId, validationErrors)}
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          {this.getCancelButton(loading, submitting)}
          {this.getActionButton(loading, submitting, handleSubmit, applicationId)}
        </Modal.Footer>
      </div>
    );
  }
});
