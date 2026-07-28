import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Error, LoadingPanel, TableAction, SectionHeader, BlankState, SearchBar } from '@a0/auth0-extension-ui';

import { GroupDeleteDialog, GroupDialog, GroupsTable } from './';
import GroupMembersDialog from './GroupMembersDialog';
import GroupsIcon from '../Icons/GroupsIcon';

class GroupsOverview extends React.Component {
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

    this.renderGroupActions = this.renderGroupActions.bind(this);
    this.fetchPickerUsers = this.fetchPickerUsers.bind(this);

    // Searchbar.
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onHandleOptionChange = this.onHandleOptionChange.bind(this);
    this.clear = this.clear.bind(this);
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

  clear() {
    this.props.clear();
  }

  onHandleOptionChange(option) {
    this.setState({
      selectedFilter: option
    });
  }

  renderGroupActions(group) {
    return (
      <div>
        <TableAction
          id={`manage-members-${group._id}`} type="default" title="Add members" icon="299"
          onClick={this.props.editGroupUsers} args={[ group ]} disabled={this.props.groups.loading || false}
        />
        <TableAction
          id={`edit-${group._id}`} type="default" title="Edit Group" icon="272"
          onClick={this.props.editGroup} args={[ group ]} disabled={this.props.groups.loading || false}
        />
        <TableAction
          id={`delete-${group._id}`} type="default" title="Delete Group" icon="471"
          onClick={this.props.requestDeleteGroup} args={[ group ]} disabled={this.props.groups.loading || false}
        />
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
        description="Create and manage groups in which you can add users, roles and nested groups."
      >
        <a href="https://auth0.com/docs/extensions/authorization-extension" rel="noopener noreferrer" target="_blank" className="btn btn-transparent btn-md">
          Read more
        </a>
        <Button variant="success" onClick={this.props.createGroup} disabled={this.props.groups.loading}>
          <i className="icon icon-budicon-473" /> Create your first group
        </Button>
      </BlankState>
    );
  }

  renderBody() {
    return (
      <div>
        <SectionHeader title="Groups" description="Create and manage groups in which you can add users, roles and nested groups.">
          <Button variant="success" onClick={this.props.createGroup} disabled={this.props.groups.loading}>
            <i className="icon icon-budicon-473" /> Create Group
          </Button>
        </SectionHeader>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-12">
            <SearchBar
              placeholder="Search for groups"
              searchOptions={this.searchBarOptions}
              handleKeyPress={this.onKeyPress}
              handleReset={this.onReset}
              handleOptionChange={this.onHandleOptionChange}
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

  addGroupMembers(data) {
    const groupId = this.props.group.get('groupId');
    this.props.addGroupMembers(groupId, data.members, () => {
      this.clear();
      this.onReset();
    });
  }

  getUserPickerDialogUsers(records) {
    let users = [ ];
    if (records && records.length) {
      users = _.map(records, (user) => {
        const value = `${user.email || user.name} - ${user.identities[0].connection}`;
        const userId = user.user_id;
        const label = user.name === user.email ? null : user.name;

        return { value, label, userId };
      });
    }
    return users;
  }

  fetchPickerUsers(q, field, reset, perPage, page, onSuccess) {
    this.props.fetchUsers(q, field, reset, perPage, page, (payload) => {
      const records = payload && payload.data ? payload.data.users : [];
      onSuccess(this.getUserPickerDialogUsers(records));
    });
  }

  render() {
    const { error, loading, records, fetchQuery } = this.props.groups;
    const users = this.props.users;

    return (
      <div>
        <GroupDialog group={this.props.group} onSave={this.props.save} onClose={this.clear} />
        <GroupDeleteDialog group={this.props.group} onCancel={this.props.cancelDelete} onConfirm={this.props.confirmDelete} />
        <GroupMembersDialog
          group={this.props.group}
          onClose={this.clear}
          onSubmit={this.addGroupMembers.bind(this)}
          totalUsers={users.get('total')}
          users={this.getUserPickerDialogUsers(users.get('records').toJS())}
          fetchUsers={this.fetchPickerUsers}
          resetFetchUsers={this.props.resetFetchUsers}
        />

        { !error && !records.size && !loading && (!fetchQuery || !fetchQuery.length) ? this.renderEmptyState() : this.renderBody() }
      </div>
    );
  }
}


GroupsOverview.propTypes = {
  onReset: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  createGroup: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  editGroupUsers: PropTypes.func.isRequired,
  requestDeleteGroup: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  cancelDelete: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  addGroupMembers: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  resetFetchUsers: PropTypes.func.isRequired
};

export default GroupsOverview;
