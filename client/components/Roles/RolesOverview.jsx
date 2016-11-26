import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel, TableAction, SectionHeader, BlankState, SearchBar } from 'auth0-extension-ui';

import { RoleDeleteDialog, RoleDialog, RolesTable } from './';
import RolesIcon from '../Icons/RolesIcon';

export default class RolesOverview extends Component {

  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    role: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    createRole: PropTypes.func.isRequired,
    editRole: PropTypes.func.isRequired,
    saveRole: PropTypes.func.isRequired,
    clearRole: PropTypes.func.isRequired,
    requestDeleteRole: PropTypes.func.isRequired,
    cancelDeleteRole: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired,
    roleApplicationSelected: PropTypes.func
  }

  constructor() {
    super();

    this.searchBarOptions = [
      {
        value: 'name',
        title: 'Name',
        filterBy: 'name'
      }
    ];

    this.state = {
      selectedFilter: this.searchBarOptions[0]
    };

    // Searchbar.
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onHandleOptionChange = this.onHandleOptionChange.bind(this);
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.onSearch(e.target.value, this.state.selectedFilter.filterBy);
    }
  }

  onReset() {
    this.props.onReset();
  }

  onHandleOptionChange(option) {
    this.setState({
      selectedFilter: option
    });
  }

  renderRoleActions = (role) => (
    <div>
      <TableAction
        id={`edit-${role._id}`} title="Edit Role" icon="274"
        onClick={this.props.editRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
      />
      <TableAction
        id={`delete-${role._id}`} title="Delete Role" icon="471"
        onClick={this.props.requestDeleteRole} args={[ role ]} disabled={this.props.roles.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
    return (
      <div>
        <RolesTable
          showIcon={false}
          applications={this.props.applications}
          roles={this.props.roles.get('records')}
          loading={loading}
          renderActions={this.renderRoleActions}
        />
      </div>
    );
  }

  renderEmptyState() {
    return (
      <BlankState
        title="Roles"
        iconImage={
          <div className="no-content-image">
            <RolesIcon />
          </div>
        }
        description="Create and manage roles (collection of permissions) for your applications. These can then be assigned to users and groups."
      >
        <a href="https://auth0.com/docs/extensions/authorization-extension" target="_blank" rel="noopener noreferrer" className="btn btn-transparent btn-md">
          Read more
        </a>
        <Button bsStyle="success" onClick={this.props.createRole} disabled={this.props.roles.loading}>
          <i className="icon icon-budicon-473" /> Create your first role
        </Button>
      </BlankState>
    );
  }

  render() {
    const { error, loading, records, fetchQuery } = this.props.roles.toJS();

    return (
      <div>
        <RoleDialog onApplicationSelected={this.props.roleApplicationSelected} applications={this.props.applications} permissions={this.props.permissions} role={this.props.role} onSave={this.props.saveRole} onClose={this.props.clearRole} />
        <RoleDeleteDialog role={this.props.role} onCancel={this.props.cancelDeleteRole} onConfirm={this.props.deleteRole} />

        { !error && !records.length && !loading && (!fetchQuery || !fetchQuery.length) ? this.renderEmptyState() : (
          <div>
            <SectionHeader title="Roles" description="Create and manage Roles (collection of permissions) for your applications which can then be added to groups.">
              <Button bsStyle="success" onClick={this.props.createRole} disabled={loading}>
                <i className="icon icon-budicon-473" /> Create Role
              </Button>
            </SectionHeader>

            <div className="row" style={{ marginBottom: '20px' }}>
              <div className="col-xs-12">
                <SearchBar
                  placeholder="Search for roles"
                  searchOptions={this.searchBarOptions}
                  handleKeyPress={this.onKeyPress}
                  handleReset={this.onReset}
                  handleOptionChange={this.onHandleOptionChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <Error message={error} />
                <LoadingPanel show={loading}>
                  {this.renderBody(records, loading)}
                </LoadingPanel>
              </div>
            </div>
          </div>
        ) }
      </div>
    );
  }
}
