import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap';
import  GroupRolesDialog from './GroupRolesDialog';
import  ItemRolesOverview from '../UserGroupRoles/ItemRolesOverview';
import { Error, LoadingPanel } from 'auth0-extension-ui';

class GroupRoles extends React.Component {
  save = (roles) => {
    this.props.saveGroupRoles(this.props.group.toJSON(), roles, () => {
      this.props.fetchRulesForGroup(this.props.groupId);
    });
  }

  render() {
    const error = this.props.group.get('error');
    const loading = this.props.group.get('loading');
    return (
      <div className="row">
        <Error message={error} />
        <LoadingPanel show={loading}>
          <GroupRolesDialog group={this.props.group}
                            addRoles={this.props.addRoles}
                            roles={this.props.roles}
                            onClose={this.props.closeAddRoles}
                            onSubmit={this.save}
                            initialValues={{
                              roles: this.props.groupRoles.get('ids').toJSON()
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
            roles={this.props.groupRoles}
            loading={false}
            applications={this.props.applications}
            role={this.props.groupRoles.get('record')}
            requestDeleteRole={this.props.requestDeleteRole}
            cancelDeleteRole={this.props.cancelDeleteRole}
            deleteRole={this.props.deleteRole}
            item={this.props.group}
            fetchRulesForItem={this.props.fetchRulesForGroup}
            itemId={this.props.groupId}
          />
        </LoadingPanel>
      </div>
    );
  }
}
GroupRoles.propTypes = {
  roles: React.PropTypes.object,
  groupRoles: React.PropTypes.object,
  applications: React.PropTypes.object
};
export default GroupRoles;
