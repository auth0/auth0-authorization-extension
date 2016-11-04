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

  static stateToProps = (state) => {
    const allRoles = state.roles.get('records').toJS();
    const selectedRoles = state.userRoles.get('records').toJS();
    return { allRoles, selectedRoles };
  };

  renderBody(all, selected) {
    const selectedIds = _.map(selected, role => role._id);
    const options = _.filter(all, role => !_.includes(selectedIds, role._id)).map(role => ({
      value: role._id,
      text: role.name
    }));

    if (!options.length) {
      return (
        <Modal.Body>
          <p className="modal-description">There are no roles you can add to this user.</p>
        </Modal.Body>
      );
    }

    return (
      <Modal.Body>
        <p className="modal-description">Add or remove roles from this user.</p>
        <Field
          name="selectedRoles"
          component={ScopeGroup}
          label="Add roles"
          options={options}
        />
      </Modal.Body>
    );
  }

  static actionsToProps = {
    ...roleActions
  }


  render() {
    const user = this.props.user.toJS();
    const title = `Manage ${user.name} roles`;
    const isVisible = this.props.addRoles;
    if (!this.props.roles) {
      return <div></div>;
    }
    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.props.onClose}>
        <Modal.Header closeButton={!user.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        {this.renderBody(this.props.allRoles, this.props.selectedRoles)}
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={user.loading || user.submitting}
                  onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={user.loading || user.submitting}
                  onClick={this.props.handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}));
