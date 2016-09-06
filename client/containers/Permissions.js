import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button, ButtonToolbar } from 'react-bootstrap';
import SectionHeader from '../components/Dashboard/SectionHeader';
import BlankState from '../components/Dashboard/BlankState';

import * as actions from '../actions';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { PermissionDeleteDialog, PermissionDialog, PermissionsTable } from '../components/Permissions';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    applications: state.applications,
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
    applications: PropTypes.object.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    fetchPermissions: PropTypes.func.isRequired,
    createPermission: PropTypes.func.isRequired,
    editPermission: PropTypes.func.isRequired,
    savePermission: PropTypes.func.isRequired,
    clearPermission: PropTypes.func.isRequired,
    requestDeletePermission: PropTypes.func.isRequired,
    cancelDeletePermission: PropTypes.func.isRequired,
    deletePermission: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchPermissions();
  }

  renderPermissionActions = (permission) => (
    <div>
      <TableAction id={`edit-${permission._id}`} type="default" title="Edit Permission" icon="266"
        onClick={this.props.editPermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
      />
      <TableAction id={`delete-${permission._id}`} type="success" title="Delete Permission" icon="263"
        onClick={this.props.requestDeletePermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <form className="advanced-search-control">
              <span className="search-area">
                <i className="icon-budicon-489"></i>
                <input className="user-input" type="text" ref="search" placeholder="Search for permissions"
                  spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress}
                />
              </span>

              <span className="controls pull-right">
                <div className="js-select custom-select">
                  <span>Search by </span><span className="truncate" data-select-value="">Application</span> <i className="icon-budicon-460"></i>
                  <select data-mode="">
                    <option value="user" selected="selected">Application</option>
                    <option value="email">Permission</option>
                  </select>
                </div>
                <button type="reset">Reset <i className="icon-budicon-471"></i></button>
              </span>
            </form>
          </div>
        </div>
        <PermissionsTable
          applications={this.props.applications}
          permissions={this.props.permissions.get('records')}
          loading={loading}
          renderActions={this.renderPermissionActions}
        />
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="spinner spinner-lg is-auth0" style={{ margin: '200px auto 0' }}>
        <div className="circle" />
      </div>
    );
  }

  renderEmptyState() {
    return (
      <BlankState
        title="Permissions"
        iconCode="292"
        description="Permissions description."
      >
        <a href="https://auth0.com/docs/extensions/authorization-extension" target="_blank" rel="noopener noreferrer" className="btn btn-transparent btn-md">
          Read more
        </a>
        <Button bsStyle="success" onClick={this.props.createPermission} disabled={this.props.permissions.loading}>
          <i className="icon icon-budicon-473" /> Create your first permission
        </Button>
      </BlankState>
    );
  }

  render() {
    const { error, loading, records } = this.props.permissions.toJS();

    if (loading) { return this.renderLoading(); }

    return (
      <div>
        <PermissionDialog applications={this.props.applications} permission={this.props.permission} onSave={this.props.savePermission} onClose={this.props.clearPermission} />
        <PermissionDeleteDialog permission={this.props.permission} onCancel={this.props.cancelDeletePermission} onConfirm={this.props.deletePermission} />

        { !error && !records.length ? this.renderEmptyState() : (
          <div>
            <SectionHeader
              title="Permissions"
              description="Create and manage permsisions (granular actions) for your applications which can then be organized in Roles."
            >
              <Button bsStyle="success" onClick={this.props.createPermission} disabled={loading}>
                <i className="icon icon-budicon-337" /> Create Permission
              </Button>
            </SectionHeader>

            <div className="row">
              <div className="col-xs-12">
                <Error message={error} />
                {this.renderBody(records, loading)}
              </div>
            </div>
          </div>
        ) }
      </div>
    );
  }
});
