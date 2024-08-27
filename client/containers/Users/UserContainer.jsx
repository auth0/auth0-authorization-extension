import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { groupPickerActions, groupMemberActions, userActions, userGroupActions } from '../../actions';

import './UserContainer.css';
import LogDialog from '../../components/Logs/LogDialog';
import UserGroups from '../../components/Users/UserGroups';
import UserLogs from '../../components/Users/UserLogs';
import UserHeader from '../../components/Users/UserHeader';
import UserProfile from '../../components/Users/UserProfile';
import UserDevices from '../../components/Users/UserDevices';

import { GroupPickerDialog, GroupMemberRemoveDialog } from '../../components/Groups';

export class UserContainer extends Component {
  constructor() {
    super();

    this.requestAddToGroup = this.requestAddToGroup.bind(this);
    this.addToGroup = this.addToGroup.bind(this);
    this.cancelRemoveMember = this.cancelRemoveMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.requestRemoveMember = this.requestRemoveMember.bind(this);
  }

  componentWillMount() {
    this.props.fetchUser(this.props.params.id);
  }

  requestAddToGroup(user) {
    this.props.openGroupPicker(`Add "${user.email || user.nickname || 'user'}" to a group`);
  }

  addToGroup(group) {
    this.props.cancelGroupPicker();
    this.props.addGroupMembers(group._id, [ this.props.user.record.get('user_id') ], () => {
      this.props.fetchUserGroups(this.props.user.record.get('user_id'));
    });
  }

  cancelRemoveMember() {
    this.props.cancelRemoveGroupMember();
  }

  removeMember(groupId, userId) {
    this.props.removeGroupMember(groupId, userId);
  }

  requestRemoveMember(user, group) {
    this.props.requestRemoveGroupMember(group, user);
  }

  render() {
    const { user, groups, allGroups, groupPicker, groupMember, log, logs, devices } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Link className="btn btn-xs btn-primary pull-right" to="/users">Back to Users</Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <UserHeader loading={user.loading} user={user.record} error={user.error} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Profile">
                <UserProfile loading={user.loading} user={user.record} error={user.error} />
              </Tab>
              <Tab eventKey={2} title="Groups">
                <UserGroups user={user.record} groups={groups} allGroups={allGroups} addToGroup={this.requestAddToGroup} removeFromGroup={this.requestRemoveMember} />
              </Tab>
              <Tab eventKey={3} title="Devices">
                <UserDevices loading={devices.loading} devices={devices.records} error={devices.error} />
              </Tab>
              <Tab eventKey={4} title="Logs">
                <LogDialog onClose={() => this.props.clearLog()} error={log.error} loading={log.loading} log={log.record} logId={log.id} />
                <UserLogs onOpen={(logId) => this.props.fetchLog(logId)} loading={logs.loading} logs={logs.records} user={user.record} error={logs.error} />
              </Tab>
            </Tabs>
          </div>
        </div>
        <GroupPickerDialog groupPicker={groupPicker} onConfirm={this.addToGroup} onCancel={this.props.cancelGroupPicker} />
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
    allGroups: state.user.get('allGroups'),
    groups: state.user.get('groups'),
    log: {
      id: state.log.get('logId'),
      record: state.log.get('record'),
      error: state.log.get('error'),
      loading: state.log.get('loading')
    },
    logs: {
      records: state.user.get('logs').get('records'),
      error: state.user.get('logs').get('error'),
      loading: state.user.get('logs').get('loading')
    },
    devices: {
      records: state.user.get('devices').get('records'),
      error: state.user.get('devices').get('error'),
      loading: state.user.get('devices').get('loading')
    }
  };
}

export default connect(mapStateToProps, { ...groupPickerActions, ...groupMemberActions, ...userActions, ...userGroupActions })(UserContainer);
