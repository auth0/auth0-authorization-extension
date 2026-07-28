import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel } from '@a0/auth0-extension-ui';

import ItemRolesDialog from '../UserGroupRoles/ItemRolesDialog';
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
          <ItemRolesDialog
            type="group"
            item={this.props.group}
            addRoles={this.props.addRoles}
            allRoles={this.props.roles.get('records').toJS()}
            selectedRoles={this.props.groupRoles.get('records').toJS()}
            applications={this.props.applications}
            onClose={this.props.closeAddRoles}
            onSubmit={this.saveGroupRoles}
          />
          <div className="col-xs-8">
            <p>
              Add or remove roles to this group. Any member of this group will also be assigned to these roles.
            </p>
          </div>
          <div className="col-xs-4">
            <Button className="pull-right" variant="success" onClick={this.props.openAddRoles}>
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
  groupId: PropTypes.string,
  roles: PropTypes.object,
  group: PropTypes.object,
  groupRoles: PropTypes.object,
  applications: PropTypes.object,
  saveGroupRoles: PropTypes.func,
  fetchRolesForGroup: PropTypes.func,
  addRoles: PropTypes.func,
  openAddRoles: PropTypes.func,
  closeAddRoles: PropTypes.func,
  deleteRole: PropTypes.func,
  cancelDeleteRole: PropTypes.func,
  requestDeleteRole: PropTypes.func
};

export default GroupRoles;
