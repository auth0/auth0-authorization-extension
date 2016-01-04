import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as ApplicationActions from '../../actions/application';
import * as PermissionActions from '../../actions/permission';

import { Error, LoadingPanel } from '../../components/Dashboard';
import PermissionsTable from '../../components/Permissions/PermissionsTable';
import PermissionDialog from '../../components/Permissions/PermissionDialog';
import DeletePermissionDialog from '../../components/Permissions/DeletePermissionDialog';

class PermissionsContainer extends Component {
  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchPermissions();
  }

  refresh() {
    this.props.fetchPermissions(true);
  }

  render() {
    return (
      <div>
        <PermissionDialog applications={this.props.applications.records} permission={this.props.permission}
          onSave={this.props.savePermission} onClose={this.props.clearPermission} />
        <DeletePermissionDialog permission={this.props.permission}
          onCancel={this.props.cancelDeletePermission} onConfirm={this.props.deletePermission} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <ButtonToolbar className="pull-right">
              <Button bsSize="xsmall" onClick={() => this.refresh()} disabled={this.props.permissions.loading}>
                <i className="icon icon-budicon-257"></i>
                Refresh
              </Button>
              <Button bsStyle="primary" bsSize="xsmall" disabled={this.props.permissions.loading} onClick={() => this.props.createPermission()}>
                <i className="icon icon-budicon-337"></i>
                Create
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={this.props.permissions.error || this.props.applications.error} />
            <LoadingPanel show={this.props.applications.loading || this.props.permissions.loading}>
              <PermissionsTable loading={this.props.permissions.loading} permissions={this.props.permissions.records} applications={this.props.applications.records}
                onEdit={this.props.editPermission} onDelete={this.props.requestingDeletePermission} />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    applications: {
      error: state.applications.get('error'),
      loading: state.applications.get('loading'),
      records: state.applications.get('records')
    },
    permission: state.permission,
    permissions: {
      error: state.permissions.get('error'),
      loading: state.permissions.get('loading'),
      records: state.permissions.get('records')
    }
  };
}

export default connect(mapStateToProps, { ...ApplicationActions, ...PermissionActions })(PermissionsContainer);
