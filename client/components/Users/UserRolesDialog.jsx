import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { ScopeGroup } from 'auth0-extension-ui';

import createForm from '../../utils/createForm';
import { roleActions } from '../../actions';

export default createForm('userRoles', connectContainer(class UserRolesDialog extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    addRoles: PropTypes.bool.isRequired,
    handleSubmit: React.PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchRoles();
  }

  static stateToProps = (state) => {
    const stateRoles = state.roles.get('records').toJS();
    const selectedRoles = state.userRoles.get('records').toJS();
    let roles = [];
    for ( let i in stateRoles ) {
      for ( let j in selectedRoles ) {
        let needPush = true;
        if (stateRoles[i]._id == selectedRoles[j]._id) {
          needPush = false;
          break;
        }
        if(needPush)
          roles.push({
            value: stateRoles[i]._id,
            text: stateRoles[i].name
          });
      }
    }
    return {
      roles
    };
  };

  static actionsToProps = {
    ...roleActions
  }


  render() {
    const user = this.props.user.toJS();
    const title = `Manage ${user.name} roles`;
    const isVisible = this.props.addRoles;
    if(!this.props.roles) {
      return <div></div>;
    }
    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.props.onClose}>
        <Modal.Header closeButton={!user.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-description">Add or remove roles from this user.</p>
          <label>Add roles</label>
          <Field
            name="selectedRoles"
            component={ScopeGroup}
            label="Roles"
            options={this.props.roles}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={user.loading || user.submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={user.loading || user.submitting} onClick={this.props.handleSubmit} >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}));
