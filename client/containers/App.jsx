import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import { configurationActions } from '../actions';

import Header from '../components/Header';
import RuleStatus from '../components/Configuration/RuleStatus';
import { Sidebar, SidebarItem } from '../components/Dashboard';

import UsersIcon from '../components/Dashboard/icons/UsersIcon';
import GroupsIcon from '../components/Dashboard/icons/GroupsIcon';
import RolesIcon from '../components/Dashboard/icons/RolesIcon';
import PermissionsIcon from '../components/Dashboard/icons/PermissionsIcon';
import ImportExportIcon from '../components/Dashboard/icons/ImportExportIcon';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    issuer: PropTypes.string,
    ruleStatus: PropTypes.object,
    logout: PropTypes.func,
    goToRules: PropTypes.func,
    goToConfiguration: PropTypes.func,
    goToImportExport: PropTypes.func
  };

  render() {
    return (
      <div>
        <Header user={this.props.user} issuer={this.props.issuer} onLogout={this.props.logout} openConfiguration={this.props.goToConfiguration} />
        <div className="container">
          <div className="row">
            <Sidebar>
              <SidebarItem icon={<UsersIcon className="item-image"/>} title="Users" route="/users" />
              <SidebarItem icon={<GroupsIcon className="item-image"/>} title="Groups" route="/groups" />
              <SidebarItem icon={<RolesIcon className="item-image"/>} title="Roles" route="/roles" />
              <SidebarItem icon={<PermissionsIcon className="item-image"/>} title="Permissions" route="/permissions" />
              <SidebarItem icon={<ImportExportIcon className="item-image"/>} title="Import/Export" route="/import-export" />
            </Sidebar>
            <div id="content" className="col-xs-10">
              <RuleStatus ruleStatus={this.props.ruleStatus}
                goToConfiguration={this.props.goToConfiguration}
                goToRules={this.props.goToRules}
                goToImportExport={this.props.goToImportExport}
              />
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    issuer: state.auth.get('issuer'),
    user: state.auth.get('user'),
    ruleStatus: state.ruleStatus
  };
}

export default connect(select, { logout, ...configurationActions })(App);
