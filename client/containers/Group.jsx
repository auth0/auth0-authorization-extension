import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { groupActions, groupNestedActions, groupMemberActions, groupMappingActions, userPickerActions, groupPickerActions } from '../actions';

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

    // Nested groups.
    this.requestAddNestedGroup = this.requestAddNestedGroup.bind(this);
    this.addNestedGroup = this.addNestedGroup.bind(this);
    this.requestRemoveNestedGroup = this.requestRemoveNestedGroup.bind(this);
    this.removeNestedGroup = this.removeNestedGroup.bind(this);
  }

  componentWillMount() {
    this.props.fetchGroup(this.props.params.id);
  }

  addMember() {
    this.props.openUserPicker(`Add members to "${this.props.group.get('record').get('name')}"`);
  }

  requestRemoveMember(user) {
    this.props.requestRemoveGroupMember(this.props.group.get('record').toJS(), user);
  }

  cancelRemoveMember() {
    this.props.cancelRemoveGroupMember();
  }

  removeMember(groupId, userId) {
    this.props.removeGroupMember(groupId, userId);
  }

  addMembers(users) {
    const groupId = this.props.group.get('groupId');
    this.props.cancelUserPicker();
    this.props.addGroupMembers(groupId, users, () => {
      this.props.fetchGroupMembers(groupId, true);
      this.props.fetchGroupMembersNested(groupId, true);
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

  addNestedGroup(nestedGroup) {
    const nestedIds = Object.keys(nestedGroup).filter(key => nestedGroup[key] === true);
    const groupId = this.props.group.get('groupId');
    this.props.cancelGroupPicker();
    this.props.addNestedGroup(groupId, nestedIds, () => {
      this.props.fetchNestedGroups(groupId, true);
      this.props.fetchGroupMembersNested(groupId, true);
    });
  }

  requestRemoveNestedGroup(nestedGroup) {
    this.props.requestRemoveNestedGroup(this.props.group.get('record').toJS(), nestedGroup);
  }

  removeNestedGroup(groupId, nestedGroupId) {
    this.props.removeNestedGroup(groupId, nestedGroupId);
  }

  renderLoading() {
    return (
      <div className="spinner spinner-lg is-auth0" style={{ margin: '200px auto 0' }}>
        <div className="circle" />
      </div>
    );
  }

  render() {
    const { connections, group, groupMember, groupMapping, userPicker, groupPicker, groupNested } = this.props;

    if (group.get('loading')) { return this.renderLoading(); }

    return (
      <div>
        <div>
          <UserPickerDialog
            userPicker={userPicker} onSelectUser={this.props.selectUser} onUnselectUser={this.props.unselectUser}
            onConfirm={this.addMembers} onCancel={this.props.cancelUserPicker} onReset={this.props.resetUserPicker} onSearch={this.props.searchUserPicker}
          />
          <GroupPickerDialog groupPicker={groupPicker} onConfirm={this.addNestedGroup} onCancel={this.props.cancelGroupPicker} />
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
            <Tabs defaultActiveKey={1} animation={false} style={{ marginTop: '20px' }}>
              <Tab eventKey={1} title="Members">
                <GroupMembers members={group.get('members')} nestedMembers={group.get('nestedMembers')} addMember={this.addMember} removeMember={this.requestRemoveMember} />
              </Tab>
              <Tab eventKey={2} title="Roles">
                <GroupRoles />
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
  group: React.PropTypes.object,
  groupMapping: React.PropTypes.object,
  groupMember: React.PropTypes.object,
  groupNested: React.PropTypes.object,
  userPicker: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  fetchGroup: React.PropTypes.func.isRequired,
  fetchGroupMappings: React.PropTypes.func.isRequired,
  createGroupMapping: React.PropTypes.func.isRequired,
  requestDeleteGroupMapping: PropTypes.func.isRequired,
  deleteGroupMapping: PropTypes.func.isRequired,
  saveGroupMapping: PropTypes.func.isRequired,
  clearGroupMapping: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    connections: state.connections,
    group: state.group,
    groupNested: state.groupNested,
    groupMember: state.groupMember,
    groupMapping: state.groupMapping,
    groupPicker: state.groupPicker,
    userPicker: state.userPicker
  };
}

export default connect(mapStateToProps, { ...groupActions, ...groupMemberActions, ...groupNestedActions, ...groupPickerActions, ...groupMappingActions, ...userPickerActions })(GroupContainer);
