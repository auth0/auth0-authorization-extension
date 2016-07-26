import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as actions from '../actions';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { PermissionDeleteDialog, PermissionDialog, PermissionsTable } from '../components/Permissions';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    applications: state.applications,
    permission: state.permission,
    permissions: state.permissions
  });

  static actionsToProps = {
    ...actions.applicationActions,
    ...actions.connectionActions,
    ...actions.permissionActions
  }

  static propTypes = {
    children: PropTypes.object,
    permission: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    fetchApplications: PropTypes.func.isRequired,
    fetchPermissions: PropTypes.func.isRequired,
    createPermission: PropTypes.func.isRequired,
    editPermission: PropTypes.func.isRequired,
    savePermission: PropTypes.func.isRequired,
    clearPermission: PropTypes.func.isRequired,
    requestDeletePermission: PropTypes.func.isRequired,
    cancelDeletePermission: PropTypes.func.isRequired,
    deletePermission: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchPermissions();
  }

  renderPermissionActions = (permission) => (
    <div>
      <TableAction id={`edit-${permission._id}`} type="default" title="Edit Permission" icon="266"
        onClick={this.props.editPermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
      />
      <span> </span>
      <TableAction id={`delete-${permission._id}`} type="success" title="Delete Permission" icon="263"
        onClick={this.props.requestDeletePermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
    if (records.length === 0) {
      return (
        <Button bsStyle="success" bsSize="large" onClick={this.props.createPermission} disabled={loading}>
          <i className="icon icon-budicon-337"></i> Create Your First Permission
        </Button>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <form className="advanced-search-control">
              <span className="search-area">
                <i className="icon-budicon-489"></i>
                <input className="user-input" type="text" ref="search" placeholder="Search for permissions"
                  spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress}
                />
              </span>

              <span className="controls pull-right">
                <div className="js-select custom-select">
                  <span>Search by </span><span className="truncate" data-select-value="">Application</span> <i className="icon-budicon-460"></i>
                  <select data-mode="">
                    <option value="user" selected="selected">Application</option>
                    <option value="email">Permission</option>
                  </select>
                </div>
                <button type="reset">Reset <i className="icon-budicon-471"></i></button>
              </span>
            </form>
          </div>
        </div>
        <PermissionsTable
          applications={this.props.applications}
          permissions={this.props.permissions.get('records')}
          loading={loading}
          renderActions={this.renderPermissionActions}
        />
      </div>
    );
  }

  render() {
    const { error, loading, records } = this.props.permissions.toJS();
    const buttonClasses = classNames({
      hidden: records.length === 0,
      'pull-right': true
    });

    return (
      <div>
        <PermissionDialog applications={this.props.applications} permission={this.props.permission} onSave={this.props.savePermission} onClose={this.props.clearPermission} />
        <PermissionDeleteDialog permission={this.props.permission} onCancel={this.props.cancelDeletePermission} onConfirm={this.props.deletePermission} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="content-header video-template">
              <ButtonToolbar className={buttonClasses}>
                <Button bsStyle="success" bsSize="large" onClick={this.props.createPermission} disabled={loading}>
                  <i className="icon icon-budicon-337"></i> Create Permission
                </Button>
              </ButtonToolbar>
              <h1>Permissions</h1>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">Create and manage permsisions (granular actions) for your applications which can then be organized in Roles.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={error} />
            <LoadingPanel show={loading}>
              {this.renderBody(records, loading)}
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
});
