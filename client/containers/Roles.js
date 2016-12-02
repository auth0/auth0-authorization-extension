import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import * as actions from '../actions';
import RolesOverview from '../components/Roles/RolesOverview';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    applications: state.applications,
    role: state.role,
    roles: state.roles,
    permissions: state.permissions
  });

  static actionsToProps = {
    ...actions.applicationActions,
    ...actions.connectionActions,
    ...actions.roleActions,
    ...actions.permissionActions
  }

  static propTypes = {
    fetchPermissions: PropTypes.func.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    fetchRoles: PropTypes.func.isRequired,
    children: PropTypes.object,
    role: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    createRole: PropTypes.func.isRequired,
    editRole: PropTypes.func.isRequired,
    saveRole: PropTypes.func.isRequired,
    clearRole: PropTypes.func.isRequired,
    requestDeleteRole: PropTypes.func.isRequired,
    cancelDeleteRole: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired,
    roleApplicationSelected: PropTypes.func
  }

  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchPermissions();
    this.props.fetchRoles();
  }

  onSearch(query, field) {
    this.props.fetchRoles(query, field);
  }

  onReset() {
    this.props.fetchRoles();
  }

  render() {
    return (
      <RolesOverview
        onReset={this.onReset}
        onSearch={this.onSearch}
        roles={this.props.roles}
        role={this.props.role}
        applications={this.props.applications}
        permissions={this.props.permissions}
        createRole={this.props.createRole}
        editRole={this.props.editRole}
        saveRole={this.props.saveRole}
        clearRole={this.props.clearRole}
        requestDeleteRole={this.props.requestDeleteRole}
        cancelDeleteRole={this.props.cancelDeleteRole}
        deleteRole={this.props.deleteRole}
        roleApplicationSelected={this.props.roleApplicationSelected}
      />
    );
  }
});
