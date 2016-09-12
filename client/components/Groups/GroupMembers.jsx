import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { LoadingPanel, Error } from '../Dashboard';
import UsersTable from '../Users/UsersTable';
import GroupMemberRemoveAction from './GroupMemberRemoveAction';
import SectionHeader from '../Dashboard/SectionHeader';
import { Table, TableCell, TableRouteCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class GroupMembers extends Component {
  constructor() {
    super();
    this.renderActions = this.renderActions.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.members !== this.props.members || nextProps.nestedMembers !== this.props.nestedMembers;
  }

  renderActions(user, index) {
    return <GroupMemberRemoveAction index={index} user={user} loading={this.props.members.get('loading')} onRemove={this.props.removeMember} />;
  }

  renderAllMembers(nestedMembers) {
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
            <h4>All Members</h4>
            <span className="pull-left">The following table lists <strong>all</strong> users for this group and nested groups.</span>
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

  render() {
    const { records, loading, error } = this.props.members.toJS();

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12">
              <Error message={error} />
            </div>
          </div>
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-xs-12">
              <ul className="nav nav-pills">
                <li className="active">
                  <a href="">Members of this group</a>
                </li>
                <li>
                  <a href="">All members</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-8">
              <p>Add members to or remove them from the group.</p>
            </div>
            <div className="col-xs-4">
              <Button className="pull-right" bsStyle="success" onClick={this.props.addMember} disabled={loading}>
                <i className="icon icon-budicon-473" /> Add member
              </Button>
            </div>
          </div>
          {this.renderMembers(loading, records)}
        </LoadingPanel>
        {this.renderAllMembers(this.props.nestedMembers.toJS())}
      </div>
    );
  }
}

GroupMembers.propTypes = {
  addMember: React.PropTypes.func.isRequired,
  removeMember: React.PropTypes.func.isRequired,
  members: React.PropTypes.object.isRequired,
  nestedMembers: React.PropTypes.object.isRequired
};

export default GroupMembers;
