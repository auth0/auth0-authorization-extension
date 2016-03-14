import { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';

import DevTools from './DevTools';
import Header from '../components/Header';
import { Sidebar, SidebarItem } from '../components/Dashboard';

class App extends Component {
  render() {
    return (
      <div>
        <Header user={this.props.user} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <Sidebar>
              <SidebarItem title="Applications" route="/applications" icon="icon icon-budicon-375" />
              <SidebarItem title="Permissions" route="/permissions" icon="icon icon-budicon-384" />
              <SidebarItem title="Roles" route="/roles" icon="icon icon-budicon-549" />
              <SidebarItem title="Groups" route="/groups" icon="icon icon-budicon-322" />
              <SidebarItem title="Users" route="/users" icon="icon icon-budicon-292" />
              <SidebarItem title="Logs" route="/logs" icon="icon icon-budicon-754" />
            </Sidebar>
            <div id="content" className="col-xs-10">
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
    user: state.auth.get('user')
  };
}

export default connect(select, { logout })(App);
