import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import * as groupActions from '../../actions/group';
import * as userPickerActions from '../../actions/userPicker';
import { GroupHeader, GroupMappingDialog, GroupMappings, GroupMembers, GroupMemberRemoveDialog } from '../../components/Groups';
import { TableAction } from '../../components/Dashboard';
import UserPickerDialog from '../../components/Users/UserPickerDialog';

export default class GroupContainer extends Component {
  constructor() {
    super();

    this.addMember = this.addMember.bind(this);
    this.addMembers = this.addMembers.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.requestRemoveMember = this.requestRemoveMember.bind(this);
    this.cancelRemoveMember = this.cancelRemoveMember.bind(this);
  }
  componentWillMount() {
    this.props.fetchGroup(this.props.params.id);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group || nextProps.groupMember !== this.props.groupMember || nextProps.userPicker !== this.props.userPicker;
  }

  saveMapping() {

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

  addMembers() {
    this.props.addGroupMembers();
  }

  render() {
    const { connections, group, groupMember, groupMapping, userPicker } = this.props;

    return (
      <div>
        <GroupMappingDialog connections={connections} groupMapping={groupMapping} onSave={this.saveMapping} onCancel={this.cancelEditMapping} />
        <GroupMemberRemoveDialog groupMember={groupMember} onConfirm={this.removeMember} onCancel={this.cancelRemoveMember} />
        <UserPickerDialog userPicker={userPicker} onSelectUser={this.props.selectUser} onUnselectUser={this.props.unselectUser}
          onConfirm={this.addMembers} onCancel={this.props.cancelUserPicker} onReset={this.props.resetUserPicker} onSearch={this.props.searchUserPicker}
        />
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
                <GroupMappings mappings={group.get('mappings')} addMember={this.addMapping} removeMember={this.requestRemoveMapping} />
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
  fetchGroup: React.PropTypes.func.isRequired
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

export default connect(mapStateToProps, { ...groupActions, ...userPickerActions })(GroupContainer);
