import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as actions from '../actions';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { RoleDeleteDialog, RoleDialog, RolesTable } from '../components/Roles';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    applications: state.applications,
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
    applications: PropTypes.object.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    fetchRoles: PropTypes.func.isRequired,
    createRole: PropTypes.func.isRequired,
    editRole: PropTypes.func.isRequired,
    saveRole: PropTypes.func.isRequired,
    clearRole: PropTypes.func.isRequired,
    requestDeleteRole: PropTypes.func.isRequired,
    cancelDeleteRole: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchRoles();
  }

  renderRoleActions = (role) => (
    <div>
      <TableAction id={`edit-${role._id}`} type="default" title="Edit Role" icon="266"
        onClick={this.props.editRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
      />
      <span> </span>
      <TableAction id={`delete-${role._id}`} type="success" title="Delete Role" icon="263"
        onClick={this.props.requestDeleteRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
    if (records.length === 0) {
      return (
        <Button bsStyle="success" bsSize="large" onClick={this.props.createRole} disabled={loading}>
          <i className="icon icon-budicon-337"></i> Create Your First Role
        </Button>
      );
    }

    return (
      <div>
        <RolesTable
          applications={this.props.applications}
          roles={this.props.roles.get('records')}
          loading={loading}
          renderActions={this.renderRoleActions}
        />
      </div>
    );
  }

  render() {
    const { error, loading, records } = this.props.roles.toJS();
    const buttonClasses = classNames({
      hidden: records.length === 0,
      'pull-right': true
    });

    return (
      <div>
        <RoleDialog applications={this.props.applications} role={this.props.role} onSave={this.props.saveRole} onClose={this.props.clearRole} />
        <RoleDeleteDialog role={this.props.role} onCancel={this.props.cancelDeleteRole} onConfirm={this.props.deleteRole} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="content-header video-template">
              <ButtonToolbar className={buttonClasses}>
                <Button bsStyle="success" bsSize="large" onClick={this.props.createRole} disabled={loading}>
                  <i className="icon icon-budicon-337"></i> Create Role
                </Button>
              </ButtonToolbar>
              <h1>Roles</h1>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">Create and manage Roles (collection of Permissions) for your applications which can then be added to Groups.</span>
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
              {this.renderBody(records, loading)}
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
});
