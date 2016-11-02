import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { ScopeGroup } from 'auth0-extension-ui';

import createForm from '../../utils/createForm';

export default createForm('groupRoles', connectContainer(class GroupRolesDialog extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    addRoles: PropTypes.bool.isRequired
  };

  static stateToProps = (state) => {
    const stateRoles = state.roles.get('records').toJS();
    let roles;
    if (stateRoles && stateRoles.length) {
      roles = _.map(stateRoles, (role) => ({
        value: role._id,
        text: role.name
      }));
    }
    return {
      roles
    };
  };

  render() {
    const group = this.props.group.toJS();
    const title = `Manage ${group.name} roles`;
    const isVisible = this.props.addRoles;
    if(!this.props.roles) {
      return <div></div>;
    }
    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.props.onClose}>
        <Modal.Header closeButton={!group.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-description">Add or remove roles from this group.</p>
          <label>Add roles</label>
          <Field
            name="selectedRoles"
            component={ScopeGroup}
            label="Roles"
            options={this.props.roles}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={group.loading || group.submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={group.loading || group.submitting} onClick={this.props.handleSubmit} >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}));
