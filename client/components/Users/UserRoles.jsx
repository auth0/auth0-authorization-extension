import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel } from '@a0/auth0-extension-ui';

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

  fetchRoles = () => {
    this.props.fetchRolesForUser(this.props.userId);
    this.props.fetchAllRolesForUser(this.props.userId);
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
            <Button className="pull-right" variant="success" onClick={this.props.openAddRoles}>
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
            fetchRolesForItem={this.fetchRoles}
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
  userId: PropTypes.string,
  roles: PropTypes.object,
  userRoles: PropTypes.object,
  applications: PropTypes.object,
  user: PropTypes.object,
  saveUserRoles: PropTypes.func,
  fetchRolesForUser: PropTypes.func,
  fetchAllRolesForUser: PropTypes.func,
  addRoles: PropTypes.func,
  openAddRoles: PropTypes.func,
  closeAddRoles: PropTypes.func,
  deleteRole: PropTypes.func,
  cancelDeleteRole: PropTypes.func,
  requestDeleteRole: PropTypes.func
};

export default UserRoles;
