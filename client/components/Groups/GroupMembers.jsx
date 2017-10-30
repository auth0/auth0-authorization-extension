import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import UsersTable from '../Users/UsersTable';
import GroupMemberRemoveAction from './GroupMemberRemoveAction';
import { Pagination, Table, TableCell, TableRouteCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow, LoadingPanel, Error } from 'auth0-extension-ui';

class GroupMembers extends Component {
  constructor() {
    super();
    this.state = {
      showGroupMembers: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.members !== this.props.members ||
      nextProps.nestedMembers !== this.props.nestedMembers ||
      nextState.showGroupMembers !== this.state.showGroupMembers;
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.showGroupMembers && !nextState.showGroupMembers) {
      this.props.getAllNestedMembersOnPage(this.props.groupId, 1);
    }
  }

  setShowGroupMembers = (showGroupMembers) => {
    this.setState({
      showGroupMembers
    });
  }

  handleMembersPageChange = (page) => {
    this.props.getGroupMembersOnPage(this.props.groupId, page);
  }

  handleAllMembersPageChange = (page) => {
    this.props.getAllNestedMembersOnPage(this.props.groupId, page);
  }

  renderActions = (user, index) => <GroupMemberRemoveAction index={index} user={user} loading={this.props.members.get('loading')} onRemove={this.props.removeMember} />

  renderAllMembersTable(nestedMembers) {
    if (nestedMembers.error) {
      return (
        <div><Error message={nestedMembers.error} /></div>
      );
    }

    if (nestedMembers.records.length === 0) {
      return <div />;
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <span className="pull-left">The following table lists <strong>all</strong> users for this group and its nested groups.</span>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableColumn width="3%" />
            <TableColumn width="52%">Name</TableColumn>
            <TableColumn width="45%">Source</TableColumn>
          </TableHeader>
          <TableBody>
            {nestedMembers.records.map((record, index) =>
              <TableRow key={index}>
                <TableIconCell color="green" icon="322" />
                <TableRouteCell route={`/users/${record.user.user_id}`}>{ record.user.name || record.user.email || record.user.user_id }</TableRouteCell>
                <TableRouteCell route={`/groups/${record.group._id}`}>{ record.group.name || 'N/A' }</TableRouteCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  renderAllMembers(nestedMembers) {
    return (
      <div>
        <LoadingPanel show={nestedMembers.loading}>
          {this.renderAllMembersTable(nestedMembers)}
        </LoadingPanel>

        <Pagination
          totalItems={nestedMembers.total}
          handlePageChange={this.handleAllMembersPageChange}
          perPage={process.env.PER_PAGE}
        />
      </div>
    );
  }

  renderMembers(loading, records) {
    if (loading || records.length) {
      return (
        <div className="row">
          <div className="col-xs-12">
            <UsersTable loading={loading} users={records} renderActions={this.renderActions} />
          </div>
        </div>
      );
    }

    return <div />;
  }

  renderGroupMembers(loading, records, total) {
    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-xs-8">
              <p>Add members to or remove them from the group.</p>
            </div>
            <div className="col-xs-4">
              <Button className="pull-right" bsStyle="success" onClick={this.props.addMember} disabled={loading}>
                <i className="icon icon-budicon-292" /> Add members
              </Button>
            </div>
          </div>
          {this.renderMembers(loading, records)}
        </LoadingPanel>
        <Pagination
          totalItems={total}
          handlePageChange={this.handleMembersPageChange}
          perPage={process.env.PER_PAGE}
        />
      </div>
    );
  }

  render() {
    const { records, loading, error, total } = this.props.members.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Error message={error} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-12">
            <ul className="nav nav-pills">
              <li className={this.state.showGroupMembers ? 'active' : null} >
                <a onClick={() => this.setShowGroupMembers(true)}>Members of this group</a>
              </li>
              <li className={!this.state.showGroupMembers ? 'active' : null}>
                <a onClick={() => this.setShowGroupMembers(false)}>All members</a>
              </li>
            </ul>
          </div>
        </div>
        { this.state.showGroupMembers ?
          this.renderGroupMembers(loading, records, total) :
          this.renderAllMembers(this.props.nestedMembers.toJS()) }
      </div>
    );
  }
}

GroupMembers.propTypes = {
  addMember: React.PropTypes.func.isRequired,
  removeMember: React.PropTypes.func.isRequired,
  members: React.PropTypes.object.isRequired,
  nestedMembers: React.PropTypes.object.isRequired,
  getGroupMembersOnPage: React.PropTypes.func.isRequired,
  getAllNestedMembersOnPage: React.PropTypes.func.isRequired,
  groupId: React.PropTypes.string.isRequired
};

export default GroupMembers;
