import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import ItemRolesDialog from '../UserGroupRoles/ItemRolesDialog';
import ItemRolesOverview from '../UserGroupRoles/ItemRolesOverview';

class UserRoles extends Component {
  constructor() {
    super();

    this.state = {
      showUserRoles: true
    };
  }

  setShowUserRoles = (showUserRoles) => {
    this.setState({
      showUserRoles
    });
  }

  saveUserRoles = (selectedRoles) => {
    if (selectedRoles) {
      this.props.saveUserRoles(this.props.user.toJSON(), selectedRoles, () => {
        this.props.fetchRolesForUser(this.props.userId);
        this.props.fetchAllRolesForUser(this.props.userId);
      });
    }
  };

  renderUserRoles(error, loading, userRoles) {
    return (
      <div>
        <ItemRolesDialog
          type="user"
          item={this.props.user}
          addRoles={this.props.addRoles}
          allRoles={this.props.roles.get('records').toJS()}
          selectedRoles={this.props.userRoles.get('records').toJS()}
          applications={this.props.applications}
          onClose={this.props.closeAddRoles}
          onSubmit={this.saveUserRoles}
        />
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-8">
            <p>These are the roles that have been directly assigned to the user.</p>
          </div>
          <div className="col-xs-4">
            <Button className="pull-right" bsStyle="success" onClick={this.props.openAddRoles}>
              <i className="icon icon-budicon-473" /> Add role to user
            </Button>
          </div>
          <ItemRolesOverview
            showIcon={false}
            roles={userRoles}
            loading={loading}
            applications={this.props.applications}
            role={userRoles.get('record')}
            requestDeleteRole={this.props.requestDeleteRole}
            cancelDeleteRole={this.props.cancelDeleteRole}
            deleteRole={this.props.deleteRole}
            item={this.props.user}
            fetchRolesForItem={this.props.fetchRolesForUser}
            itemId={this.props.userId}
          />
        </div>
      </div>
    );
  }

  renderAllRoles(error, loading, allRoles) {
    return (
      <div className="row" style={{ marginBottom: '20px' }}>
        <div className="col-xs-12">
          <p>These are all roles the user has been assigned to. Including roles originating from group memberships.</p>
        </div>
        <ItemRolesOverview
          showIcon
          roles={allRoles}
          loading={loading}
          applications={this.props.applications}
          item={this.props.user}
          fetchRolesForItem={this.props.fetchAllRolesForUser}
          itemId={this.props.userId}
        />
      </div>
    );
  }

  render() {
    const error = this.props.user.get('error');
    const loading = this.props.user.get('loading');
    const allRoles = this.props.userRoles.get('allRoles');

    return (
      <div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-xs-12">
              <Error message={error} />
            </div>
          </div>
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-xs-12">
              <ul className="nav nav-pills">
                <li className={this.state.showUserRoles ? 'active' : null} >
                  <a onClick={() => this.setShowUserRoles(true)}>Roles</a>
                </li>
                <li className={!this.state.showUserRoles ? 'active' : null}>
                  <a onClick={() => this.setShowUserRoles(false)}>All Roles</a>
                </li>
              </ul>
            </div>
          </div>
          { this.state.showUserRoles ?
            this.renderUserRoles(error, loading, this.props.userRoles) :
            this.renderAllRoles(error, loading, allRoles) }
        </LoadingPanel>
      </div>
    );
  }
}

UserRoles.propTypes = {
  userId: React.PropTypes.string,
  roles: React.PropTypes.object,
  userRoles: React.PropTypes.object,
  applications: React.PropTypes.object,
  user: React.PropTypes.object,
  saveUserRoles: React.PropTypes.func,
  fetchRolesForUser: React.PropTypes.func,
  fetchAllRolesForUser: React.PropTypes.func,
  addRoles: React.PropTypes.func,
  openAddRoles: React.PropTypes.func,
  closeAddRoles: React.PropTypes.func,
  deleteRole: React.PropTypes.func,
  cancelDeleteRole: React.PropTypes.func,
  requestDeleteRole: React.PropTypes.func
};

export default UserRoles;
