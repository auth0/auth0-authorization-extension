import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import { groupActions, groupMemberActions, groupMappingActions, userPickerActions } from '../../actions';

import UserPickerDialog from '../../components/Users/UserPickerDialog';
import { GroupHeader, GroupMappingDialog, GroupMappings, GroupMembers, GroupMemberRemoveDialog } from '../../components/Groups';

export default class GroupContainer extends Component {
  constructor() {
    super();

    this.addMember = this.addMember.bind(this);
    this.addMembers = this.addMembers.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.requestRemoveMember = this.requestRemoveMember.bind(this);
    this.cancelRemoveMember = this.cancelRemoveMember.bind(this);

        this.saveMapping = this.saveMapping.bind(this);
  }
  componentWillMount() {
    this.props.fetchGroup(this.props.params.id);
  }

  saveMapping(group, groupMapping) {
    console.log(group, groupMapping);
  }
    cancelEditMapping() {

    }


  requestRemoveMapping(mapping) {

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
    this.props.cancelUserPicker();
    this.props.addGroupMembers(this.props.group.get('groupId'), users, () => {
      this.props.fetchGroupMembers(groupId, true);
    });
  }

  render() {
    const { connections, group, groupMember, groupMapping, userPicker } = this.props;

    return (
      <div>
        <div>
          <GroupMappingDialog group={group} connections={connections} groupMapping={groupMapping} onSave={this.props.saveGroupMapping} onClose={this.props.clearGroupMapping} />
          <GroupMemberRemoveDialog groupMember={groupMember} onConfirm={this.removeMember} onCancel={this.cancelRemoveMember} />
          <UserPickerDialog userPicker={userPicker} onSelectUser={this.props.selectUser} onUnselectUser={this.props.unselectUser}
            onConfirm={this.addMembers} onCancel={this.props.cancelUserPicker} onReset={this.props.resetUserPicker} onSearch={this.props.searchUserPicker}
          />
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Link className="btn btn-xs btn-default pull-right" to="/groups">
              <i className="icon icon-budicon-257"></i> Back to Groups
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <GroupHeader group={group} members={group.get('members')} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Members">
                <GroupMembers members={group.get('members')} addMember={this.addMember} removeMember={this.requestRemoveMember} />
              </Tab>
              <Tab eventKey={2} title="Mappings">
                <GroupMappings mappings={group.get('mappings')} createMapping={this.props.createGroupMapping} removeMapping={this.requestRemoveMapping} />
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
  groupMember: React.PropTypes.object,
  userPicker: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  fetchGroup: React.PropTypes.func.isRequired,
  createGroupMapping: React.PropTypes.func.isRequired,
  saveGroupMapping: React.PropTypes.func.isRequired,
  clearGroupMapping: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    connections: state.connections,
    group: state.group,
    groupMember: state.groupMember,
    groupMapping: state.groupMapping,
    userPicker: state.userPicker
  };
}

export default connect(mapStateToProps, { ...groupActions, ...groupMemberActions, ...groupMappingActions, ...userPickerActions })(GroupContainer);
