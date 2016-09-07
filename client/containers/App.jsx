import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import { configurationActions } from '../actions';

import Header from '../components/Header';
import RuleStatus from '../components/Configuration/RuleStatus';
import { Sidebar, SidebarItem } from '../components/Dashboard';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    issuer: PropTypes.string,
    ruleStatus: PropTypes.object,
    logout: PropTypes.func,
    goToRules: PropTypes.func,
    goToConfiguration: PropTypes.func
  };

  render() {
    return (
      <div>
        <Header user={this.props.user} issuer={this.props.issuer} onLogout={this.props.logout} openConfiguration={this.props.goToConfiguration} />
        <div className="container">
          <div className="row">
            <Sidebar>
              <SidebarItem icon="users" title="Users" route="/users" />
              <SidebarItem icon="groups" title="Groups" route="/groups" />
              <SidebarItem icon="roles" title="Roles" route="/roles" />
              <SidebarItem icon="permissions" title="Permissions" route="/permissions" />
            </Sidebar>
            <div id="content" className="col-xs-10">
              <RuleStatus ruleStatus={this.props.ruleStatus}
                goToConfiguration={this.props.goToConfiguration}
                goToRules={this.props.goToRules}
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
