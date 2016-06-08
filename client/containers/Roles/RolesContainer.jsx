import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as RoleActions from '../../actions/role';

import { Error, LoadingPanel } from '../../components/Dashboard';
import RolesTable from '../../components/Roles/RolesTable';
import RoleDialog from '../../components/Roles/RoleDialog';
import DeleteRoleDialog from '../../components/Roles/DeleteRoleDialog';

class RolesContainer extends Component {
  componentWillMount() {
    this.props.fetchRoles();
  }

  refresh() {
    this.props.fetchRoles(true);
  }

  render() {
    return (
      <div>
        <RoleDialog role={this.props.role}
          onSave={this.props.saveRole} onClose={this.props.clearRole} />
        <DeleteRoleDialog role={this.props.role}
          onCancel={this.props.cancelDeleteRole} onConfirm={this.props.deleteRole} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <ButtonToolbar className="pull-right">
              <Button bsSize="small" onClick={() => this.refresh()} disabled={this.props.roles.loading}>
                <i className="icon icon-budicon-257"></i>
                Refresh
              </Button>
              <Button bsStyle="primary" bsSize="small" disabled={this.props.roles.loading} onClick={() => this.props.createRole()}>
                <i className="icon icon-budicon-337"></i>
                Create
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={this.props.roles.error} />
            <LoadingPanel show={this.props.roles.loading}>
              <RolesTable loading={this.props.roles.loading} roles={this.props.roles.records}
                onEdit={this.props.editRole} onDelete={this.props.requestDeleteRole} />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    role: state.role,
    roles: {
      error: state.roles.get('error'),
      loading: state.roles.get('loading'),
      records: state.roles.get('records')
    }
  };
}

export default connect(mapStateToProps, { ...RoleActions })(RolesContainer);
