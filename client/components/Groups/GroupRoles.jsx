import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap';
import  GroupRolesDialog from './GroupRolesDialog';
import  ItemRolesOverview from '../UserGroupRoles/ItemRolesOverview';

class GroupRoles extends React.Component {

  save = (roles) => {
    this.props.saveGroupRoles(this.props.group.toJSON(), roles, () => {
      this.props.fetchRulesForGroup(this.props.groupId);
    });
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
    return (
      <div className="row">
        <GroupRolesDialog group={this.props.group} addRoles={this.props.addRoles}
                          onClose={this.props.closeAddRoles} onSubmit={this.save}
                          initialValues={{
                            roles: this.getRolesIds()
                          }}
        />
        <div className="col-xs-8">
          <p>
            Add or remove roles to this group to manage users permissions to your applications.
          </p>
        </div>
        <div className="col-xs-4">
          <Button className="pull-right" bsStyle="success" onClick={this.props.openAddRoles}>
            <i className="icon icon-budicon-473" /> Add role
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
          item={this.props.group}
          fetchRulesForItem={this.props.fetchRulesForGroup}
          itemId={this.props.groupId}
        />
      </div>
    );
  }
}
GroupRoles.propTypes = {
         roles: React.PropTypes.object,
  applications: React.PropTypes.object
};
export default GroupRoles;
