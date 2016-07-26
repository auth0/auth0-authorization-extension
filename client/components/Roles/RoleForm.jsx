import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import createForm from '../../utils/createForm';
import { InputText, InputCombo, LoadingPanel } from '../Dashboard';

export default createForm('role', class extends Component {
  static propTypes = {
    validationErrors: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    applications: PropTypes.array.isRequired,
    isNew: PropTypes.bool.isRequired
  };

  static formFields = [
    'name',
    'description',
    'applicationId'
  ];

  state = {
    isNew: false,
    mode: 'edit-role'
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isNew) {
      return;
    }

    this.setState({
      isNew: nextProps.isNew,
      mode: nextProps.isNew ? 'select-app' : 'edit-role'
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

  getFields(name, description, applications, applicationId, validationErrors) {
    if (this.state.mode === 'select-app') {
      return (
        <div>
          <InputCombo options={applications} field={applicationId} fieldName="applicationId" label="Application"
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
        <InputCombo options={applications} field={applicationId} fieldName="applicationId" label="Application"
          validationErrors={validationErrors} readOnly
        />
        <div className="scope-toggle">
          <input type="checkbox" value="read:clients" className="scope-input" />
          <label className="status">read:clients</label>
        </div>
        <div className="scope-toggle">
          <input type="checkbox" value="read:clients" checked="checked" className="scope-input" />
          <label className="status">read:clients</label>
        </div>
        <div className="scope-toggle">
          <input type="checkbox" value="read:clients" checked="checked" disabled="disabled" className="scope-input" />
          <label className="status">read:clients</label>
        </div>
        <div className="scope-toggle">
          <input type="checkbox" value="read:clients" disabled="disabled" className="scope-input" />
          <label className="status">read:clients</label>
        </div>
      </div>
    )
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
    const { fields: { name, description, applicationId }, mode, handleSubmit, loading, submitting, validationErrors } = this.props;
    const applications = this.props.applications.map(app => ({
      value: app.client_id,
      text: `${app.name}`
    }));

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <LoadingPanel show={loading}>
            {this.getFields(name, description, applications, applicationId, validationErrors)}
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" disabled={ loading || submitting } onClick={this.props.onClose}>
            <i className="icon icon-budicon-501"></i> Cancel
          </Button>
          {this.getActionButton(loading, submitting, this.props.onClose)}
        </Modal.Footer>
      </div>
    );
  }
});
