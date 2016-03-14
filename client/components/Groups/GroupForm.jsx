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
        </LoadingPanel>
      </Modal.Body>
      <Modal.Footer>
        <ButtonToolbar>
          <Button bsSize="small" disabled={ loading || submitting } onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsStyle="primary" bsSize="small" disabled={ loading || submitting } onClick={handleSubmit}>
            Save
          </Button>
        </ButtonToolbar>
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
