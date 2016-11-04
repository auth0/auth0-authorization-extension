import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import  UserRolesDialog from './UserRolesDialog';
import  ItemRolesOverview from '../UserGroupRoles/ItemRolesOverview';

class UserRoles extends Component {

  save = (roles) => {
    this.props.saveUserRoles(this.props.user.toJSON(), roles);
  }

  getRolesIds = () => {
    console.log(this.props.roles,111111111);
    const stateRoles = this.props.roles.get('records').toJS();
    let roles;
    if (stateRoles && stateRoles.length) {
      roles = _.map(stateRoles, (role) => (role._id));
    }
    return roles;
  }

  render() {
    return (
      <div>
        <UserRolesDialog user={this.props.user} addRoles={this.props.addRoles}
                         onClose={this.props.closeAddRoles} onSubmit={this.save}
                         initialValues={{
                           roles: this.getRolesIds()
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
            roles={this.props.roles}
            loading={false}
            applications={this.props.applications}
            role={this.props.roles.get('record')}
            requestDeleteRole={this.props.requestDeleteRole}
            cancelDeleteRole={this.props.cancelDeleteRole}
            deleteRole={this.props.deleteRole}
          />
        </div>
      </div>
    );
  }
}
UserRoles.propTypes = {
  roles: React.PropTypes.object,
  applications: React.PropTypes.object
};
export default UserRoles;
