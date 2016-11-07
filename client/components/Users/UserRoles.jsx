import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import UserRolesDialog from './UserRolesDialog';
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

  saveUserRoles = (roles) => {
    if (roles.selectedRoles) {
      this.props.saveUserRoles(this.props.user.toJSON(), roles.selectedRoles, () => {
        this.props.fetchRolesForUser(this.props.userId);
        this.props.fetchAllRolesForUser(this.props.userId);
      });
    }
  };

  renderUserRoles(error, loading, userRoles) {
    return (
      <div>
        <UserRolesDialog
          user={this.props.user}
          addRoles={this.props.addRoles}
          onClose={this.props.closeAddRoles}
          onSubmit={this.saveUserRoles}
          roles={this.props.roles}
          selectedRoles={this.props.userRoles.get('records').toJSON()}
        />
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-8">
            <p>Roles description</p>
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
          <p>All roles description</p>
        </div>
        <ItemRolesOverview
          showIcon={true}
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
