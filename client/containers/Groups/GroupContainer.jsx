import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import * as groupActions from '../../actions/group';
import * as userPickerActions from '../../actions/userPicker';
import { GroupHeader, GroupMembers } from '../../components/Groups';
import { TableAction } from '../../components/Dashboard';
import UserPickerDialog from '../../components/Users/UserPickerDialog';

export default class GroupContainer extends Component {
  constructor() {
    super();

    this.addMember = this.addMember.bind(this);
    this.addMembers = this.addMembers.bind(this);
    this.removeMember = this.removeMember.bind(this);
  }
  componentWillMount() {
    this.props.fetchGroup(this.props.params.id);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group || nextProps.userPicker !== this.props.userPicker;
  }

  addMember() {
    this.props.openUserPicker(`Add members to "${this.props.group.get('record').get('name')}"`);
  }

  removeMember(user) {
    this.props.removeGroupMember(this.props.group.get('record').toJS(), user);
  }

  addMembers() {
    this.props.addGroupMembers();
  }

  render() {
    const { group, userPicker } = this.props;

    return (
      <div>
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
                <GroupMembers members={group.get('members')} addMember={this.addMember} removeMember={this.removeMember} />
              </Tab>
              <Tab eventKey={2} title="Mappings">
                <div>
                  Mappings
                </div>
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
  params: React.PropTypes.object.isRequired,
  fetchGroup: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    group: state.group,
    userPicker: state.userPicker
  };
}

export default connect(mapStateToProps, { ...groupActions, ...userPickerActions })(GroupContainer);
