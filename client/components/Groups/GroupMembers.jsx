import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { LoadingPanel, Error } from '../Dashboard';
import UsersTable from '../Users/UsersTable';
import GroupMemberRemoveAction from './GroupMemberRemoveAction';

class GroupMembers extends Component {
  constructor() {
    super();
    this.renderActions = this.renderActions.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.members !== this.props.members;
  }

  renderActions(user, index) {
    return <GroupMemberRemoveAction index={index} user={user} loading={this.props.members.get('loading')} onRemove={this.props.removeMember} />;
  }

  render() {
    const { records, loading, error } = this.props.members.toJS();

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <span className="pull-left">Add members to or remove them from the group.</span>
              <ButtonToolbar className="pull-right">
                <Button bsStyle="primary" bsSize="xsmall" onClick={this.props.addMember} disabled={loading}>
                  <i className="icon icon-budicon-337"></i> Add
                </Button>
              </ButtonToolbar>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
                <UsersTable loading={loading} users={records} renderActions={this.renderActions} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

GroupMembers.propTypes = {
  addMember: React.PropTypes.func.isRequired,
  removeMember: React.PropTypes.func.isRequired,
  members: React.PropTypes.object.isRequired
};

export default GroupMembers;
