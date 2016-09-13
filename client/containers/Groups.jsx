import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import SectionHeader from '../components/Dashboard/SectionHeader';
import BlankState from '../components/Dashboard/BlankState';
import SearchBar from '../components/Dashboard/SearchBar';

import { connectionActions } from '../actions';
import * as actions from '../actions/group';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { GroupDeleteDialog, GroupDialog, GroupsTable } from '../components/Groups';
import GroupUsersDialog from '../components/Groups/GroupUsersDialog';
import GroupsIcon from '../components/Dashboard/icons/GroupsIcon';

class GroupsContainer extends Component {
  constructor() {
    super();

    this.refresh = this.refresh.bind(this);
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.renderGroupActions = this.renderGroupActions.bind(this);
  }

  componentWillMount() {
    this.props.fetchGroups();
    this.props.fetchConnections();
  }

  refresh() {
    this.props.fetchGroups(true);
  }

  save(group) {
    this.props.saveGroup(group);
  }

  clear(group) {
    this.props.clearGroup(group);
  }

  confirmDelete(group) {
    this.props.deleteGroup(group);
  }

  cancelDelete(group) {
    this.props.cancelDeleteGroup(group);
  }

  renderGroupActions(group) {
    return (
      <div>
        <TableAction id={`manage-members-${group._id}`} type="default" title="Manage members" icon="299"
          onClick={this.props.editGroupUsers} args={[ group ]} disabled={this.props.groups.loading || false}
        />
        <TableAction id={`edit-${group._id}`} type="default" title="Edit Group" icon="272"
          onClick={this.props.editGroup} args={[ group ]} disabled={this.props.groups.loading || false}
        />
        <TableAction id={`delete-${group._id}`} type="default" title="Delete Group" icon="264"
          onClick={this.props.requestDeleteGroup} args={[ group ]} disabled={this.props.groups.loading || false}
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
      <BlankState
        title="Groups"
        iconImage={
          <div className="no-content-image">
            <GroupsIcon />
          </div>
        }
        description="Create and manage groups in which you can add users to define dynamic group memberships."
      >
        <a href="https://auth0.com/docs/extensions/authorization-extension" rel="noopener noreferrer" target="_blank" className="btn btn-transparent btn-md">
          Read more
        </a>
        <Button bsStyle="success" onClick={this.props.createGroup} disabled={this.props.groups.loading}>
          <i className="icon icon-budicon-473" /> Create your first group
        </Button>
      </BlankState>
    );
  }

  renderBody() {
    return (
      <div>
        <SectionHeader title="Groups" description="Create and manage groups in which you can add users and define dynamic group memberships.">
          <Button bsStyle="success" onClick={this.props.createGroup} disabled={this.props.groups.loading}>
            <i className="icon icon-budicon-473" /> Create Group
          </Button>
        </SectionHeader>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-12">
            <SearchBar
              placeholder="Search for groups"
              searchOptions={[
                {
                  value: 'group',
                  title: 'Group'
                },
                {
                  value: 'email',
                  title: 'Email'
                },
                {
                  value: 'connection',
                  title: 'Connection'
                }
              ]}
              handleKeyPress={() => { console.log('SearchBar key press'); }}
              handleReset={() => { console.log('SearchBar handleReset'); }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Error message={this.props.groups.error} />
            <LoadingPanel show={this.props.groups.loading}>
              <GroupsTable canOpenGroup groups={this.props.groups.records} loading={this.props.groups.loading} renderActions={this.renderGroupActions} />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { error, loading, records } = this.props.groups;

    if (this.props.children) {
      return this.props.children;
    }

    if (loading) { return this.renderLoading(); }

    return (
      <div>
        <GroupDialog group={this.props.group} onSave={this.save} onClose={this.clear} />
        <GroupDeleteDialog group={this.props.group} onCancel={this.cancelDelete} onConfirm={this.confirmDelete} />
        <GroupUsersDialog group={this.props.group} onClose={this.clear} />

        { !error && !records.size ? this.renderEmptyState() : this.renderBody() }
      </div>
    );
  }
}

GroupsContainer.propTypes = {
  children: React.PropTypes.object,
  group: React.PropTypes.object.isRequired,
  groups: React.PropTypes.object.isRequired,
  fetchConnections: PropTypes.func.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  createGroup: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  requestDeleteGroup: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    group: state.group,
    groups: {
      error: state.groups.get('error'),
      loading: state.groups.get('loading'),
      records: state.groups.get('records')
    }
  };
}

export default connect(mapStateToProps, { ...actions, ...connectionActions })(GroupsContainer);
