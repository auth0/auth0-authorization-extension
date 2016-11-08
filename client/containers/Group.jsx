import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { groupActions, groupNestedActions, groupMemberActions, groupMappingActions, userPickerActions, groupPickerActions, userActions, applicationActions, roleActions } from '../actions';

import UserPickerDialog from '../components/Users/UserPickerDialog';
import GroupRoles from '../components/Groups/GroupRoles';
import { GroupPickerDialog, GroupHeader, GroupMappingDialog, GroupMappingRemoveDialog, GroupMappings, GroupMembers, GroupMemberRemoveDialog, NestedGroups, NestedGroupRemoveDialog } from '../components/Groups';

export class GroupContainer extends Component {
  constructor() {
    super();

    this.addMember = this.addMember.bind(this);
    this.addMembers = this.addMembers.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.requestRemoveMember = this.requestRemoveMember.bind(this);
    this.cancelRemoveMember = this.cancelRemoveMember.bind(this);
    this.saveGroupMapping = this.saveGroupMapping.bind(this);
    this.getGroupMembersOnPage = this.getGroupMembersOnPage.bind(this);
    this.getAllNestedMembersOnPage = this.getAllNestedMembersOnPage.bind(this);

    // Nested groups.
    this.requestAddNestedGroup = this.requestAddNestedGroup.bind(this);
    this.addNestedGroup = this.addNestedGroup.bind(this);
    this.requestRemoveNestedGroup = this.requestRemoveNestedGroup.bind(this);
    this.removeNestedGroup = this.removeNestedGroup.bind(this);
  }

  componentWillMount() {
    this.props.fetchRoles();
    this.props.fetchRolesForGroup(this.props.params.id);
    this.props.fetchGroup(this.props.params.id);
    this.props.fetchApplications();
  }

  getUserPickerDialogUsers(records) {
    let users;
    if (records && records.length) {
      users = _.map(records, (user) => ({
        value: user.email,
        label: user.name,
        userId: user.user_id
      }));
    }
    return users;
  }

  getGroupMembersOnPage(groupId, page) {
    if (!groupId || !page) return;
    this.props.fetchGroupMembers(groupId, true, process.env.PER_PAGE, page);
  }

  getAllNestedMembersOnPage(groupId, page) {
    if (!groupId || !page) return;
    this.props.fetchGroupMembersNested(groupId, true, process.env.PER_PAGE, page);
  }

  requestRemoveMember(user) {
    this.props.requestRemoveGroupMember(this.props.group.get('record').toJS(), user);
  }

  requestRemoveNestedGroup(nestedGroup) {
    this.props.requestRemoveNestedGroup(this.props.group.get('record').toJS(), nestedGroup);
  }

  removeNestedGroup(groupId, nestedGroupId) {
    this.props.removeNestedGroup(groupId, nestedGroupId);
  }

  addMember() {
    this.props.openUserPicker(`Add members to ${this.props.group.get('record').get('name')}`);
  }

  addNestedGroup(nestedGroup) {
    const nestedIds = Object.keys(nestedGroup).filter(key => nestedGroup[key] === true);
    const groupId = this.props.group.get('groupId');
    this.props.cancelGroupPicker();
    if (nestedIds.length) {
      this.props.addNestedGroup(groupId, nestedIds, () => {
        this.props.fetchNestedGroups(groupId, true);
        this.props.fetchGroupMembersNested(groupId, true, process.env.PER_PAGE);
      });
    }
  }

  removeMember(groupId, userId) {
    this.props.removeGroupMember(groupId, userId);
  }

  addMembers(data) {
    const groupId = this.props.group.get('groupId');
    this.props.cancelUserPicker();
    this.props.addGroupMembers(groupId, data.members, () => {
      this.props.fetchGroupMembers(groupId, true, process.env.PER_PAGE);
      this.props.fetchGroupMembersNested(groupId, true, process.env.PER_PAGE);
    });
  }

  // Create or update a group mapping.
  saveGroupMapping(group, groupMapping) {
    this.props.saveGroupMapping(group, groupMapping, () => {
      this.props.fetchGroupMappings(group._id, true);
    });
  }

  requestAddNestedGroup() {
    this.props.openGroupPicker(`Add a nested group to "${this.props.group.get('record').get('name')}"`);
  }

  cancelRemoveMember() {
    this.props.cancelRemoveGroupMember();
  }

  renderLoading() {
    return (
      <div className="spinner spinner-lg is-auth0" style={{ margin: '200px auto 0' }}>
        <div className="circle" />
      </div>
    );
  }

  render() {
    const { connections, group, groupMember, groupMapping, userPicker, groupPicker, groupNested, users, addRoles } = this.props;
    const excludedGroups = group.get('nested').get('records').toJS();
    excludedGroups.push({ _id: this.props.params.id });

    if (group.get('loading')) { return this.renderLoading(); }
    return (
      <div>
        <div>
          <UserPickerDialog
            userPicker={userPicker} onSelectUser={this.props.selectUser} onUnselectUser={this.props.unselectUser}
            onSubmit={this.addMembers} onCancel={this.props.cancelUserPicker} onReset={this.props.resetUserPicker}
            onSearch={this.props.searchUserPicker}
            totalUsers={users.get('total')}
            users={this.getUserPickerDialogUsers(users.get('records').toJS())}
            fetchUsers={this.props.fetchUsers}
          />
          <GroupPickerDialog groupPicker={groupPicker} excludedGroups={excludedGroups} onConfirm={this.addNestedGroup} onCancel={this.props.cancelGroupPicker} />
          <GroupMappingDialog group={group} connections={connections} groupMapping={groupMapping} onSave={this.saveGroupMapping} onClose={this.props.clearGroupMapping} />
          <GroupMappingRemoveDialog group={group} groupMapping={groupMapping} onConfirm={this.props.deleteGroupMapping} onCancel={this.props.cancelDeleteGroupMapping} />
          <GroupMemberRemoveDialog groupMember={groupMember} onConfirm={this.removeMember} onCancel={this.cancelRemoveMember} />
          <NestedGroupRemoveDialog groupNested={groupNested} onConfirm={this.removeNestedGroup} onCancel={this.props.cancelRemoveNestedGroup} />
        </div>
        <div className="row">
          <div className="col-xs-12">
            <GroupHeader
              group={group}
              groupJSON={group.toJSON()}
              members={group.get('members')}
              editGroup={this.props.editGroup}
              updateGroup={this.props.updateGroup}
              closeUpdate={this.props.closeUpdate}
              requestDeleteGroup={this.props.requestDeleteGroup}
              deleteGroup={this.props.deleteGroup}
              closeDelete={this.props.closeDelete}
              fetchGroup={this.props.fetchGroup}
              id={this.props.params.id}
              goToGroups={this.props.goToGroups}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false} style={{ marginTop: '20px' }} id="group-tabs">
              <Tab eventKey={1} title="Members">
                <GroupMembers
                  groupId={group.get('groupId')} members={group.get('members')} nestedMembers={group.get('nestedMembers')} addMember={this.addMember} removeMember={this.requestRemoveMember}
                  getGroupMembersOnPage={this.getGroupMembersOnPage} getAllNestedMembersOnPage={this.getAllNestedMembersOnPage}
                />
              </Tab>
              <Tab eventKey={2} title="Roles">
                <GroupRoles
                  group={group.get('record')}
                  addRoles={addRoles}
                  openAddRoles={this.props.groupOpenAddRoles}
                  closeAddRoles={this.props.groupCloseAddRoles}
                  saveGroupRoles={this.props.saveGroupRoles}
                  requestDeleteRole={this.props.requestDeleteGroupRole}
                  cancelDeleteRole={this.props.cancelDeleteGroupRole}
                  deleteRole={this.props.deleteGroupRole}
                  roles={this.props.roles}
                  groupRoles={this.props.groupRoles}
                  loading={group.get('loading')}
                  applications={this.props.applications}
                  fetchRolesForGroup={this.props.fetchRolesForGroup}
                  groupId={this.props.params.id}
                />
              </Tab>
              <Tab eventKey={3} title="Nested Groups">
                <NestedGroups nested={group.get('nested')} addNestedGroup={this.requestAddNestedGroup} removeNestedGroup={this.requestRemoveNestedGroup} />
              </Tab>
              <Tab eventKey={4} title="Group Mappings">
                <GroupMappings mappings={group.get('mappings')} createMapping={this.props.createGroupMapping} removeMapping={this.props.requestDeleteGroupMapping} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

GroupContainer.propTypes = {
  group: PropTypes.object,
  roles: PropTypes.object,
  connections: PropTypes.object,
  groupPicker: PropTypes.object,
  users: PropTypes.object,
  addRoles: PropTypes.object,
  groupMapping: PropTypes.object,
  groupMember: PropTypes.object,
  groupNested: PropTypes.object,
  userPicker: PropTypes.object,
  params: PropTypes.object.isRequired,
  applications: PropTypes.object.isRequired,
  groupRoles: PropTypes.object.isRequired,
  fetchGroup: PropTypes.func.isRequired,
  fetchGroupMappings: PropTypes.func.isRequired,
  fetchRolesForGroup: PropTypes.func.isRequired,
  createGroupMapping: PropTypes.func.isRequired,
  requestDeleteGroupMapping: PropTypes.func.isRequired,
  requestDeleteGroupRole: PropTypes.func.isRequired,
  deleteGroupRole: PropTypes.func.isRequired,
  saveGroupRoles: PropTypes.func.isRequired,
  cancelDeleteGroupRole: PropTypes.func.isRequired,
  deleteGroupMapping: PropTypes.func.isRequired,
  saveGroupMapping: PropTypes.func.isRequired,
  groupCloseAddRoles: PropTypes.func.isRequired,
  groupOpenAddRoles: PropTypes.func.isRequired,
  clearGroupMapping: PropTypes.func.isRequired,
  fetchRoles: PropTypes.func.isRequired,
  fetchApplications: PropTypes.func.isRequired,
  openUserPicker: PropTypes.func.isRequired,
  requestRemoveGroupMember: PropTypes.func.isRequired,
  cancelRemoveGroupMember: PropTypes.func.isRequired,
  removeGroupMember: PropTypes.func.isRequired,
  cancelUserPicker: PropTypes.func.isRequired,
  addGroupMembers: PropTypes.func.isRequired,
  fetchGroupMembers: PropTypes.func.isRequired,
  fetchGroupMembersNested: PropTypes.func.isRequired,
  openGroupPicker: PropTypes.func.isRequired,
  cancelGroupPicker: PropTypes.func.isRequired,
  addNestedGroup: PropTypes.func.isRequired,
  fetchNestedGroups: PropTypes.func.isRequired,
  requestRemoveNestedGroup: PropTypes.func.isRequired,
  removeNestedGroup: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  updateGroup: PropTypes.func.isRequired,
  closeUpdate: PropTypes.func.isRequired,
  requestDeleteGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  closeDelete: PropTypes.func.isRequired,
  goToGroups: PropTypes.func.isRequired,
  unselectUser: PropTypes.func.isRequired,
  resetUserPicker: PropTypes.func.isRequired,
  cancelDeleteGroupMapping: PropTypes.func.isRequired,
  cancelRemoveNestedGroup: PropTypes.func.isRequired,
  selectUser: PropTypes.func.isRequired,
  searchUserPicker: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    connections: state.connections,
    group: state.group,
    addRoles: state.group.get('addRoles'),
    groupRoles: state.groupRoles,
    roles: state.roles,
    groupNested: state.groupNested,
    groupMember: state.groupMember,
    groupMapping: state.groupMapping,
    groupPicker: state.groupPicker,
    userPicker: state.userPicker,
    applications: state.applications,
    users: state.users
  };
}

export default connect(mapStateToProps, { ...groupActions, ...groupMemberActions, ...groupNestedActions, ...groupPickerActions, ...groupMappingActions, ...userPickerActions, ...userActions, ...applicationActions, ...roleActions })(GroupContainer);
