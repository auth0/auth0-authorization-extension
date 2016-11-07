import React, { Component, PropTypes } from 'react';
import { Error, LoadingPanel, TableAction } from 'auth0-extension-ui';
import RoleDeleteDialog from './RoleDeleteDialog';
import RolesTable from '../Roles/RolesTable';

export default class ItemRolesOverview extends Component {

  static propTypes = {
    roles: PropTypes.object.isRequired,
    role: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    applications: PropTypes.object.isRequired,
    requestDeleteRole: PropTypes.func.isRequired,
    cancelDeleteRole: PropTypes.func.isRequired,
    fetchRolesForItem: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired,
    showIcon: PropTypes.bool
  }

  deleteRole = () => {
    this.props.deleteRole(this.props.item.toJSON(), this.props.role.toJSON(), () => {
      this.props.fetchRolesForItem(this.props.itemId);
    });
  };

  renderRoleActions = (role) => {

    if (this.props.requestDeleteRole) {
      return (
        <div>
          <TableAction
            id={`delete-${role._id}`} title="Delete Role" icon="471"
            onClick={this.props.requestDeleteRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
          />
        </div>
      );
    }

    return null;
  };

  renderBody(records, loading, error, showIcon) {
    if (!error && !records.length) {
      return (
        <div />
      );
    }

    return (
      <div className="col-xs-12">
        <Error message={error} />
        <LoadingPanel show={loading}>
          <div>
            <RolesTable
              showIcon={showIcon}
              applications={this.props.applications}
              roles={this.props.roles.get('records')}
              loading={loading}
              renderActions={this.renderRoleActions}
            />
          </div>
        </LoadingPanel>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="spinner spinner-lg is-auth0" style={{ margin: '200px auto 0' }}>
        <div className="circle" />
      </div>
    );
  }

  renderEmptyState() {
    return (
      <div />
    );
  }

  renderDeleteDialog(record, deleting, cancelDeleteRole, deleteRole) {
    if (!record) {
      return '';
    }

    return (
      <RoleDeleteDialog
        role={record}
        onCancel={cancelDeleteRole}
        onConfirm={deleteRole}
        deleting={deleting}
      />
    );
  }

  render() {
    const { error, loading, records, deleting, record } = this.props.roles.toJS();
    const showIcon = this.props.showIcon;

    if (loading) {
      return this.renderLoading();
    }

    return (
      <div>
        { this.renderDeleteDialog(record, deleting, this.props.cancelDeleteRole, this.deleteRole) }
        { this.renderBody(records, loading, error, showIcon) }
      </div>
    );
  }
}
