import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as actions from '../actions';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { PermissionDeleteDialog, PermissionDialog, PermissionsTable } from '../components/Permissions';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    permission: state.permission,
    permissions: state.permissions
  });

  static actionsToProps = {
    ...actions.applicationActions,
    ...actions.connectionActions,
    ...actions.permissionActions
  }

  static propTypes = {
    children: PropTypes.object,
    permission: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    fetchPermissions: PropTypes.func.isRequired,
    createPermission: PropTypes.func.isRequired,
    editPermission: PropTypes.func.isRequired,
    requestDeletePermission: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplications();
  }

  renderPermissionActions(permission) {
    return (
      <div>
        <TableAction id={`edit-${permission._id}`} type="default" title="Edit Permission" icon="266"
          onClick={this.props.editPermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
        />
        <span> </span>
        <TableAction id={`delete-${permission._id}`} type="success" title="Delete Permission" icon="263"
          onClick={this.props.requestDeletePermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
        />
      </div>
    );
  }

  render() {
    const { error, loading } = this.props.permissions.toJS();

    return (
      <div>
        <PermissionDialog permission={this.props.permission} onSave={this.props.savePermission} onClose={this.props.clearPermission} />
        <PermissionDeleteDialog permission={this.props.permission} onCancel={this.props.cancelDeletePermission} onConfirm={this.props.deletePermission} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="content-header video-template">
              <ButtonToolbar className="pull-right">
                <Button bsSize="small" onClick={this.props.fetchPermissions} disabled={loading}>
                  <i className="icon icon-budicon-257"></i> Refresh
                </Button>
                <Button bsStyle="primary" bsSize="small" onClick={this.props.createPermission} disabled={loading}>
                  <i className="icon icon-budicon-337"></i> Create
                </Button>
              </ButtonToolbar>
              <h1>Permissions</h1>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">Create and manage permsisions (granular actions) for your applications.</span>
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
              <PermissionsTable
                permissions={this.props.permissions.get('records')}
                loading={loading}
                renderActions={this.renderPermissionActions}
              />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
});
