import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { Field } from 'redux-form';

import createForm from '../../utils/createForm';
import { InputText, InputCombo, LoadingPanel } from '@a0/auth0-extension-ui';

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
            <p className="modal-description">Select the application for which this permission applies to and give it a name.</p>
            <form className="form-horizontal">
              <Field
                name="name" component={InputText}
                label="Name" placeholder="e.g. read:invoice, delete:user, edit:book"
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
            </form>
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="transparent" disabled={loading || submitting} onClick={this.props.onClose}> Cancel </Button>
          <Button variant="primary" size="lg" disabled={loading || submitting} onClick={handleSubmit}> { isNew ? 'Create' : 'Save' } </Button>
        </Modal.Footer>
      </div>
    );
  }
});
