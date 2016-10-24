import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import createForm from '../../utils/createForm';
import { InputText, InputCombo, LoadingPanel, ScopeGroup } from '../Dashboard';

const roleForm = createForm('role', class extends Component {
  static propTypes = {
    validationErrors: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    permissions: PropTypes.array.isRequired,
    applications: PropTypes.array.isRequired,
    isNew: PropTypes.bool.isRequired,
    onApplicationSelected: PropTypes.func.isRequired,
    applicationId: PropTypes.string
  };

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

  initStateValues(applicationId, applications, permissions) {
    this.setState({
      applicationId,
      applications: applications.map(app => ({
        value: app.client_id,
        text: `${app.name}`
      })),
      permissions: permissions
        .filter(perm => perm.applicationId === applicationId)
        .map(perm => ({
          value: perm._id,
          text: perm.name
        }))
    });
  }

  componentWillMount() {
    this.initStateValues(this.props.applicationId || this.props.initialValues.applicationId, this.props.applications, this.props.permissions);
  }

  componentWillReceiveProps(nextProps) {
    this.initStateValues(nextProps.applicationId || nextProps.initialValues.applicationId, nextProps.applications, nextProps.permissions);
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

  getFields(validationErrors) {
    if (this.props.page === 'chooseApplication') {
      return (
        <div>
          <p className="modal-description">
            Give a name, description (optional) and permissions for this role.
          </p>
          <Field
            name="applicationId" component={InputCombo}
            options={this.state.applications} label="Application"
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
        <Field
          name="applicationId" component={InputCombo}
          options={this.state.applications} label="Application"
          validationErrors={validationErrors} disabled
        />
        <Field
          name="name" component={InputText}
          label="Name" validationErrors={validationErrors}
        />
        <Field
          name="description" component={InputText}
          label="Description" validationErrors={validationErrors}
        />
        <Field
          name="permissions" component={ScopeGroup}
          label="Permissions" options={this.state.permissions}
        />
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

  getActionButton(loading, submitting, handleSubmit) {
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
    const { handleSubmit, loading, submitting, validationErrors } = this.props;

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <LoadingPanel show={loading}>
            {this.getFields(validationErrors)}
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          {this.getCancelButton(loading, submitting)}
          {this.getActionButton(loading, submitting, handleSubmit)}
        </Modal.Footer>
      </div>
    );
  }
});

// Decorate with connect to read form values
const selector = formValueSelector('role');
const connectDecorator = connect(state => {
  const applicationId = selector(state, 'applicationId');

  return {
    applicationId
  };
});

export default connectDecorator(roleForm);
