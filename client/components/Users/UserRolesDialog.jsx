import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { Table, TableHeader, TableRow, TableColumn, TableBody, TableTextCell, TableCell } from 'auth0-extension-ui';

import { roleActions } from '../../actions';

export default connectContainer(class UserRolesDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRoles: []
    };
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    addRoles: PropTypes.bool.isRequired,
    applications: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  static stateToProps = (state) => {
    const allRoles = state.roles.get('records').toJS();
    const selectedRoles = state.userRoles.get('records').toJS();
    return { allRoles, selectedRoles };
  };

  getApplication(applications, applicationId) {
    return _.filter(applications, application => application.client_id === applicationId)
            .map(application => application.name);
  }

  updateSelectedRoles = (ev) => {
    const roles = this.state.selectedRoles;
    roles.push(ev.target.value);
    this.setState({
      selectedRoles: roles
    });
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.selectedRoles);
  }

  renderBody(all, selected) {
    const selectedIds = _.map(selected, role => role._id);
    const options = _.filter(all, role => !_.includes(selectedIds, role._id)).map(role => ({
      _id: role._id,
      name: role.name,
      applicationId: role.applicationId
    }));

    const applications = this.props.applications.get('records').toJS();

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
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table>
            <TableHeader>
              <TableColumn width="5%" />
              <TableColumn width="45%">Name</TableColumn>
              <TableColumn width="50%">Application</TableColumn>
            </TableHeader>
            <TableBody>
              {_.sortBy(options, 'name').map((option, index) =>
                <TableRow>
                  <TableCell>
                    <input
                      value={option._id}
                      type="checkbox"
                      onChange={this.updateSelectedRoles}
                    />
                  </TableCell>
                  <TableTextCell>{ option.name}</TableTextCell>
                  <TableTextCell>{ this.getApplication(applications, option.applicationId) }</TableTextCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
      return <div />;
    }

    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.props.onClose}>
        <Modal.Header closeButton={!user.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        {this.renderBody(this.props.allRoles, this.props.selectedRoles)}
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={user.loading || user.submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={user.loading || user.submitting} onClick={this.handleSubmit} >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});
