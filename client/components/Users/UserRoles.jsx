import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import  UserRolesDialog from './UserRolesDialog';
import  ItemRolesOverview from '../UserGroupRoles/ItemRolesOverview';
import { Error, LoadingPanel } from 'auth0-extension-ui';

class UserRoles extends Component {

  save = (roles) => {
    if(roles.selectedRoles) {
      this.props.saveUserRoles(this.props.user.toJSON(), roles.selectedRoles, () => {
        this.props.fetchRulesForUser(this.props.userId);
      });
    }
  }

  getRolesIds = () => {
    const stateRoles = this.props.roles.get('records').toJS();
    let roles;
    if (stateRoles && stateRoles.length) {
      roles = _.map(stateRoles, (role) => (role._id));
    }
    return roles;
  }

  render() {
    const error = this.props.user.get('error');
    const loading = this.props.user.get('loading');
    return (
      <div>
        <Error message={error} />
        <LoadingPanel show={loading}>
          <UserRolesDialog user={this.props.user}
                           addRoles={this.props.addRoles}
                           onClose={this.props.closeAddRoles}
                           onSubmit={this.save}
                           initialValues={{
                             roles: this.props.userRoles.get('ids').toJSON()
                           }
                           }
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
              fetchRulesForItem={this.props.fetchRulesForUser}
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
