import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import UserRolesDialog from './UserRolesDialog';
import ItemRolesOverview from '../UserGroupRoles/ItemRolesOverview';

class UserRoles extends Component {
  saveUserRoles = (roles) => {
    if (roles.selectedRoles) {
      this.props.saveUserRoles(this.props.user.toJSON(), roles.selectedRoles, () => {
        this.props.fetchRolesForUser(this.props.userId);
      });
    }
  };

  render() {
    const error = this.props.user.get('error');
    const loading = this.props.user.get('loading');
    return (
      <div>
        <Error message={error} />
        <LoadingPanel show={loading}>
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
              roles={this.props.userRoles}
              loading={false}
              applications={this.props.applications}
              role={this.props.userRoles.get('record')}
              requestDeleteRole={this.props.requestDeleteRole}
              cancelDeleteRole={this.props.cancelDeleteRole}
              deleteRole={this.props.deleteRole}
              item={this.props.user}
              fetchRolesForItem={this.props.fetchRolesForUser}
              itemId={this.props.userId}
            />
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

UserRoles.propTypes = {
  roles: React.PropTypes.object,
  userRoles: React.PropTypes.object,
  applications: React.PropTypes.object
};

export default UserRoles;
