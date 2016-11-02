import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel, TableAction, SectionHeader, BlankState, SearchBar } from 'auth0-extension-ui';
import  RoleDeleteDialog from './RoleDeleteDialog';
import  RolesTable from './RolesTable';

export default class ItemRolesOverview extends Component {

  static propTypes = {
    role: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    applications: PropTypes.object.isRequired,
    requestDeleteRole: PropTypes.func.isRequired,
    cancelDeleteRole: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired
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

  deleteRole = () => {
    this.props.deleteRole(this.props.item.toJSON(), this.props.role.toJSON(), () => {
      this.props.fetchRulesForItem(this.props.itemId);
    });
  }

  renderRoleActions = (role) => (
    <div>
      <TableAction
        id={`delete-${role._id}`} title="Delete Role" icon="264"
        onClick={this.props.requestDeleteRole} args={[role]} disabled={this.props.roles.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
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
      <div></div>
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
          <RoleDeleteDialog role={record}
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
                  {this.renderBody(records, loading)}
                </LoadingPanel>
              </div>
            </div>
          </div>
        ) }
      </div>
    );
  }
};
