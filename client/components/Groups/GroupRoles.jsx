import React from 'react';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import GroupRolesDialog from './GroupRolesDialog';
import ItemRolesOverview from '../UserGroupRoles/ItemRolesOverview';

class GroupRoles extends React.Component {
  saveGroupRoles = (selectedRoles) => {
    if (selectedRoles) {
      this.props.saveGroupRoles(this.props.group.toJSON(), selectedRoles, () => {
        this.props.fetchRolesForGroup(this.props.groupId);
      });
    }
  };

  render() {
    const error = this.props.group.get('error');
    const loading = this.props.group.get('loading');
    return (
      <div className="row">
        <Error message={error} />
        <LoadingPanel show={loading}>
          <GroupRolesDialog
            group={this.props.group}
            addRoles={this.props.addRoles}
            roles={this.props.roles}
            applications={this.props.applications}
            onClose={this.props.closeAddRoles}
            onSubmit={this.saveGroupRoles}
            selectedRoles={this.props.groupRoles.get('records').toJSON()}
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
            fetchRolesForItem={this.props.fetchRolesForGroup}
            itemId={this.props.groupId}
          />
        </LoadingPanel>
      </div>
    );
  }
}

GroupRoles.propTypes = {
  groupId: React.PropTypes.string,
  roles: React.PropTypes.object,
  group: React.PropTypes.object,
  groupRoles: React.PropTypes.object,
  applications: React.PropTypes.object,
  saveGroupRoles: React.PropTypes.func,
  fetchRolesForGroup: React.PropTypes.func,
  addRoles: React.PropTypes.func,
  openAddRoles: React.PropTypes.func,
  closeAddRoles: React.PropTypes.func,
  deleteRole: React.PropTypes.func,
  cancelDeleteRole: React.PropTypes.func,
  requestDeleteRole: React.PropTypes.func
};

export default GroupRoles;
