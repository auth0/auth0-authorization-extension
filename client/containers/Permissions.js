import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Error, LoadingPanel, TableAction, SectionHeader, BlankState, SearchBar } from 'auth0-extension-ui';

import * as actions from '../actions';
import { PermissionDeleteDialog, PermissionDialog, PermissionsTable } from '../components/Permissions';
import PermissionsIcon from '../components/Icons/PermissionsIcon';

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
      <TableAction
        id={`delete-${permission._id}`} type="default" title="Delete Permission" icon="264"
        onClick={this.props.requestDeletePermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
    return (
      <div>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-12">
            <SearchBar
              placeholder="Search for permissions"
              searchOptions={[
                {
                  value: 'name',
                  title: 'Name',
                  selected: true
                },
                {
                  value: 'application',
                  title: 'Application'
                },
                {
                  value: 'description',
                  title: 'Description'
                }
              ]}
              handleKeyPress={(e) => {
                if (e.charCode === 13) {
                  // Enter key pressed
                  e.preventDefault();
                  // Search
                }
              }}
              handleReset={() => {}}
            />
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
        iconImage={
          <div className="no-content-image">
            <PermissionsIcon />
          </div>
        }
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
              description="Define permissions for your apps that you can then group in Roles and assign to users."
            >
              <Button bsStyle="success" onClick={this.props.createPermission} disabled={loading}>
                <i className="icon icon-budicon-473" /> Create Permission
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
