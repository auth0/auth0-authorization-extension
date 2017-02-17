import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';
import { InputText, LoadingPanel } from 'auth0-extension-ui';

import createForm from '../../utils/createForm';

export default createForm('group', class GroupForm extends Component {
  static propTypes = {
    validationErrors: React.PropTypes.object,
    loading: React.PropTypes.bool.isRequired,
    submitting: React.PropTypes.bool,
    handleSubmit: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired,
    children: React.PropTypes.node
  };

  render() {
    const { handleSubmit, loading, submitting, validationErrors, isNew } = this.props;
    return (<div>
      <Modal.Body>
        <LoadingPanel show={loading}>
          { isNew &&
            <p className="modal-description">
              Give your group a name. After creating the group you'll be able to assing users and roles to it.
            </p>
          }
          {this.props.children}
          <form className="form-horizontal">
            <Field
              name="name" component={InputText} label="Name"
              validationErrors={validationErrors}
            />
            <Field
              name="description" component={InputText}
              label="Description" validationErrors={validationErrors}
            />
          </form>
        </LoadingPanel>
      </Modal.Body>
      <Modal.Footer>
        <Button bsSize="large" bsStyle="transparent" disabled={loading || submitting} onClick={this.props.onClose}>
          Cancel
        </Button>
        <Button bsSize="large" bsStyle="primary" disabled={loading || submitting} onClick={handleSubmit}>
          { isNew ? 'Create' : 'Save' }
        </Button>
      </Modal.Footer>
    </div>);
  }
});
