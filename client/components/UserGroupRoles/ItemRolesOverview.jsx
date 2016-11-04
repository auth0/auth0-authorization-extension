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
    deleteRole: PropTypes.func.isRequired
  }

  deleteRole = () => {
    this.props.deleteRole(this.props.item.toJSON(), this.props.role.toJSON(), () => {
      this.props.fetchRolesForItem(this.props.itemId);
    });
  };

  renderRoleActions = (role) => (
    <div>
      <TableAction
        id={`delete-${role._id}`} title="Delete Role" icon="264"
        onClick={this.props.requestDeleteRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
      />
    </div>
  );

  renderBody(loading) {
    return (
      <div>
        <RolesTable
          applications={this.props.applications}
          roles={this.props.roles.get('records')}
          loading={loading}
          renderActions={this.renderRoleActions}
        />
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

  render() {
    const { error, loading, records, deleting, record } = this.props.roles.toJS();

    if (loading) {
      return this.renderLoading();
    }

    return (
      <div>
        {(record) ?
          <RoleDeleteDialog
            role={record}
            onCancel={this.props.cancelDeleteRole}
            onConfirm={this.deleteRole}
            deleting={deleting}
          />
          : '' }
        { !error && !records.length ? this.renderEmptyState() : (
          <div>
            <div className="row">
              <div className="col-xs-12">
                <Error message={error} />
                <LoadingPanel show={loading}>
                  {this.renderBody(loading)}
                </LoadingPanel>
              </div>
            </div>
          </div>
        ) }
      </div>
    );
  }
}
