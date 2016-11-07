import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Field } from 'redux-form';

import createForm from '../../utils/createForm';
import { InputText, InputCombo, LoadingPanel } from 'auth0-extension-ui';

export default createForm('permission', class extends Component {
  static propTypes = {
    validationErrors: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    applications: PropTypes.object.isRequired,
    isNew: PropTypes.bool,
    children: PropTypes.node
  };

  render() {
    const { handleSubmit, loading, submitting, validationErrors, isNew } = this.props;
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

            <Field
              name="name" component={InputText}
              label="Name" placeholder="e.g. read:invoce, delete:user, edit:book"
              validationErrors={validationErrors}
            />
            <Field
              name="description" component={InputText}
              label="Description" validationErrors={validationErrors}
            />
            <Field
              name="applicationId" component={InputCombo}
              options={applications} label="Application"
              validationErrors={validationErrors}
            />

          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" disabled={loading || submitting} onClick={this.props.onClose}> Cancel </Button>
          <Button bsStyle="primary" bsSize="large" disabled={loading || submitting} onClick={handleSubmit}> { isNew ? 'Create' : 'Save' } </Button>
        </Modal.Footer>
      </div>
    );
  }
});
