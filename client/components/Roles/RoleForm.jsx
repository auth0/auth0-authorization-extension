import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import createForm from '../../utils/createForm';
import { InputText, LoadingPanel } from '../Dashboard';

export default createForm('role', class extends Component {
  static propTypes = {
    validationErrors: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static formFields = [
    'name',
    'description'
  ];

  render() {
    const { fields: { name, description }, handleSubmit, loading, submitting, validationErrors } = this.props;

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <LoadingPanel show={loading}>
            <InputText field={name} fieldName="name" label="Name"
              validationErrors={validationErrors}
            />
            <InputText field={description} fieldName="description" label="Description"
              validationErrors={validationErrors}
            />
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" disabled={ loading || submitting } onClick={this.props.onClose}>
            <i className="icon icon-budicon-501"></i> Cancel
          </Button>
          <Button bsStyle="primary" bsSize="small" disabled={ loading || submitting } onClick={handleSubmit}>
            <i className="icon icon-budicon-245"></i> Save
          </Button>
        </Modal.Footer>
      </div>
    );
  }
});
