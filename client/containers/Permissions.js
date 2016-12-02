import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import * as actions from '../actions';
import PermissionsOverview from '../components/Permissions/PermissionsOverview';

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

  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchPermissions();
  }

  onSearch(query, field) {
    this.props.fetchPermissions(query, field);
  }

  onReset() {
    this.props.fetchPermissions();
  }

  render() {
    return (
      <PermissionsOverview
        onReset={this.onReset}
        onSearch={this.onSearch}
        permission={this.props.permission}
        permissions={this.props.permissions}
        applications={this.props.applications}
        createPermission={this.props.createPermission}
        editPermission={this.props.editPermission}
        savePermission={this.props.savePermission}
        clearPermission={this.props.clearPermission}
        requestDeletePermission={this.props.requestDeletePermission}
        cancelDeletePermission={this.props.cancelDeletePermission}
        deletePermission={this.props.deletePermission}
      />
    );
  }
});
