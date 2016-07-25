import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as actions from '../actions';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { RoleDeleteDialog, RoleDialog, RolesTable } from '../components/Roles';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    role: state.role,
    roles: state.roles
  });

  static actionsToProps = {
    ...actions.applicationActions,
    ...actions.connectionActions,
    ...actions.roleActions
  }

  static propTypes = {
    children: PropTypes.object,
    role: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    fetchRoles: PropTypes.func.isRequired,
    createRole: PropTypes.func.isRequired,
    editRole: PropTypes.func.isRequired,
    requestDeleteRole: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplications();
  }

  renderRoleActions(role) {
    return (
      <div>
        <TableAction id={`edit-${role._id}`} type="default" title="Edit Role" icon="266"
          onClick={this.props.editRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
        />
        <span> </span>
        <TableAction id={`delete-${role._id}`} type="success" title="Delete Role" icon="263"
          onClick={this.props.requestDeleteRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
        />
      </div>
    );
  }

  render() {
    const { error, loading } = this.props.roles.toJS();

    return (
      <div>
        <RoleDialog role={this.props.role} onSave={this.props.saveRole} onClose={this.props.clearRole} />
        <RoleDeleteDialog role={this.props.role} onCancel={this.props.cancelDeleteRole} onConfirm={this.props.deleteRole} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="content-header video-template">
              <ButtonToolbar className="pull-right">
                <Button bsSize="small" onClick={this.props.fetchRoles} disabled={loading}>
                  <i className="icon icon-budicon-257"></i> Refresh
                </Button>
                <Button bsStyle="primary" bsSize="small" onClick={this.props.createRole} disabled={loading}>
                  <i className="icon icon-budicon-337"></i> Create
                </Button>
              </ButtonToolbar>
              <h1>Roles</h1>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">Create and manage roles (group of permissions) for your applications.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={error} />
            <LoadingPanel show={loading}>
              <RolesTable
                roles={this.props.roles.get('records')}
                loading={loading}
                renderActions={this.renderRoleActions}
              />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
});
