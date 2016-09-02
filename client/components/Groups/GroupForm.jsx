import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import { InputText, LoadingPanel } from '../Dashboard';

class GroupForm extends Component {
  render() {
    const { fields: { name, description }, handleSubmit, loading, submitting, validationErrors } = this.props;

    return <div>
      <Modal.Body>
        {this.props.children}
        <LoadingPanel show={loading}>
          <InputText field={name} fieldName="name" label="Name"
            validationErrors={validationErrors} />
          <InputText field={description} fieldName="description" label="Description"
            validationErrors={validationErrors} />
          <InputText fieldName="members" label="Members" validationErrors={validationErrors} />
        </LoadingPanel>
      </Modal.Body>
      <Modal.Footer>
        <Button bsSize="large" bsStyle="transparent" disabled={ loading || submitting } onClick={this.props.onClose}>
          Cancel
        </Button>
        <Button bsSize="large" bsStyle="primary" disabled={ loading || submitting } onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </div>;
  }
}

GroupForm.propTypes = {
  validationErrors: React.PropTypes.object,
  loading: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default reduxForm({ form: 'group', fields: [ 'name', 'description' ] })(GroupForm);
