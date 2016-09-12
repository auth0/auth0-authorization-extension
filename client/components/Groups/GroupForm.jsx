import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { InputText, LoadingPanel } from '../Dashboard';
import Multiselect from '../Dashboard/Multiselect';

class GroupForm extends Component {
  render() {
    const { fields: { name, description }, handleSubmit, loading, submitting, validationErrors, isNew } = this.props;
    return <div>
      <Modal.Body>
        <LoadingPanel show={loading}>
          { isNew &&
            <p className="modal-description">
              Name your group and add members. You can also edit name and membership later.
            </p>
          }
          {this.props.children}
          <InputText
            field={name} fieldName="name" label="Name"
            validationErrors={validationErrors}
          />
          <InputText
            field={description} fieldName="description" label="Description"
            validationErrors={validationErrors}
          />
          <label htmlFor="">Members</label>
          <Multiselect
            options={[
              { value: 'ariel', label: 'Ariel Gerstein', email: 'ariel@auth0.com' },
              { value: 'victor', label: 'Victor Fernandez', email: 'victor@auth0.com' },
              { value: 'ricky', label: 'Ricky Rauch', email: 'ricky@auth0.com' },
              { value: 'cherna', label: 'Tomas Cherna', email: 'cherna@auth0.com' }
            ]}
          />
        </LoadingPanel>
      </Modal.Body>
      <Modal.Footer>
        <Button bsSize="large" bsStyle="transparent" disabled={ loading || submitting } onClick={this.props.onClose}>
          Cancel
        </Button>
        <Button bsSize="large" bsStyle="primary" disabled={ loading || submitting } onClick={handleSubmit}>
          Create
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
