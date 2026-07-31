import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { groupPickerActions, groupMemberActions, userActions, userGroupActions, applicationActions, roleActions } from '../actions';

import UserGroups from '../components/Users/UserGroups';
import UserHeader from '../components/Users/UserHeader';
import UserRoles from '../components/Users/UserRoles';
import UserProfile from '../components/Users/UserProfile';

import { GroupPickerDialog, GroupMemberRemoveDialog } from '../components/Groups';

export class UserContainer extends Component {
  constructor() {
    super();

    this.state = {
      selectedTab: 2
    };
    this.requestAddToGroup = this.requestAddToGroup.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
    this.cancelRemoveMember = this.cancelRemoveMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.requestRemoveMember = this.requestRemoveMember.bind(this);
  }

  componentDidMount() {
    this.props.fetchRoles();
    this.props.fetchUser(this.props.params.id);
    this.props.fetchRolesForUser(this.props.params.id);
    this.props.fetchAllRolesForUser(this.props.params.id);
    this.props.fetchApplications();
  }

  requestAddToGroup(user) {
    this.props.openGroupPicker(`Add ${user.nickname || user.email || 'user'} to one or more groups`);
  }

  addToGroup(groups) {
    const groupIds = Object.keys(groups).filter(key => groups[key] === true);
    this.props.cancelGroupPicker();
    if (groupIds.length) {
      this.props.addUserToGroups(this.props.user.record.get('user_id'), groupIds, () => {
        this.props.fetchUserGroups(this.props.user.record.get('user_id'));
        this.props.fetchAllRolesForUser(this.props.user.record.get('user_id'));
      });
    }
  }

  cancelRemoveMember() {
    this.props.cancelRemoveGroupMember();
  }

  removeMember(groupId, userId) {
    this.props.removeGroupMember(groupId, userId, () => {
      this.props.fetchAllRolesForUser(userId);
    });
  }

  requestRemoveMember(user, group) {
    this.props.requestRemoveGroupMember(group, user);
  }

  onTabChanged = (key) => {
    this.setState({
      selectedTab: key
    });
  };

  renderLoading() {
    return (
      <div className="spinner spinner-lg is-auth0" style={{ margin: '200px auto 0' }}>
        <div className="circle" />
      </div>
    );
  }

  render() {
    const { user, groups, allGroups, groupPicker, groupMember } = this.props;
    const excludedGroups = groups.get('records').toJS();
    if (user.loading) { return this.renderLoading(); }
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <UserHeader user={user.record} error={user.error} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Tabs onSelect={this.onTabChanged} defaultActiveKey={this.state.selectedTab} style={{ marginTop: '20px' }} id="user-tabs">
              <Tab eventKey={1} title="Profile">
                <UserProfile loading={user.loading} user={user.record} error={user.error} />
              </Tab>
              <Tab eventKey={2} title="Groups">
                <UserGroups user={user.record} groups={groups} allGroups={allGroups} addToGroup={this.requestAddToGroup} removeFromGroup={this.requestRemoveMember} />
              </Tab>
              <Tab eventKey={3} title="Roles">
                <UserRoles
                  user={user.record}
                  addRoles={this.props.addRoles}
                  openAddRoles={this.props.openAddRoles}
                  closeAddRoles={this.props.closeAddRoles}
                  saveUserRoles={this.props.saveUserRoles}
                  requestDeleteRole={this.props.requestDeleteUserRole}
                  cancelDeleteRole={this.props.cancelDeleteUserRole}
                  deleteRole={this.props.deleteUserRole}
                  roles={this.props.roles}
                  userRoles={this.props.userRoles}
                  loading={user.loading}
                  applications={this.props.applications}
                  fetchRolesForUser={this.props.fetchRolesForUser}
                  fetchAllRolesForUser={this.props.fetchAllRolesForUser}
                  userId={this.props.params.id}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
        <GroupPickerDialog groupPicker={groupPicker} excludedGroups={excludedGroups} onConfirm={this.addToGroup} onCancel={this.props.cancelGroupPicker} />
        <GroupMemberRemoveDialog groupMember={groupMember} onConfirm={this.removeMember} onCancel={this.cancelRemoveMember} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    groupPicker: state.groupPicker,
    groupMember: state.groupMember,
    user: {
      record: state.user.get('record'),
      error: state.user.get('error'),
      loading: state.user.get('loading')
    },
    addRoles: state.user.get('addRoles'),
    applications: state.applications,
    userRoles: state.userRoles,
    roles: state.roles,
    allGroups: state.user.get('allGroups'),
    groups: state.user.get('groups')
  };
}

UserContainer.propTypes = {
  group: PropTypes.object,
  fetchGroup: PropTypes.func,
  fetchRoles: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchAllRolesForUser: PropTypes.func.isRequired,
  fetchApplications: PropTypes.func.isRequired,
  openGroupPicker: PropTypes.func.isRequired,
  addUserToGroups: PropTypes.func.isRequired,
  fetchUserGroups: PropTypes.func.isRequired,
  cancelRemoveGroupMember: PropTypes.func.isRequired,
  removeGroupMember: PropTypes.func.isRequired,
  requestRemoveGroupMember: PropTypes.func.isRequired,
  addRoles: PropTypes.func.isRequired,
  openAddRoles: PropTypes.func.isRequired,
  closeAddRoles: PropTypes.func.isRequired,
  saveUserRoles: PropTypes.func.isRequired,
  requestDeleteUserRole: PropTypes.func.isRequired,
  cancelDeleteUserRole: PropTypes.func.isRequired,
  deleteUserRole: PropTypes.func.isRequired,
  fetchRolesForUser: PropTypes.func.isRequired,
  cancelGroupPicker: PropTypes.func.isRequired,
  roles: PropTypes.object.isRequired,
  userRoles: PropTypes.object.isRequired,
  applications: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  allGroups: PropTypes.object.isRequired,
  groupPicker: PropTypes.object.isRequired,
  groupMember: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { ...groupPickerActions, ...groupMemberActions, ...userActions, ...userGroupActions, ...applicationActions, ...roleActions })(UserContainer);
