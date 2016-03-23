import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import UserGroupRemoveAction from './UserGroupRemoveAction';
import { Error, LoadingPanel, Table, TableCell, TableRouteCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class UserGroups extends Component {
  constructor() {
    super();

    this.addToGroup = this.addToGroup.bind(this);
    this.removeFromGroup = this.removeFromGroup.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.groups !== this.props.groups || nextProps.allGroups !== this.props.allGroups;
  }

  getHelpText(groups) {
    if (groups.length === 0) {
      return <span>This user does not belong to any groups.</span>;
    }

    return <span>These are the explicit group memberships of the user where a user has directly been added to a group.</span>;
  }

  addToGroup() {
    this.props.addToGroup(this.props.user.toJS());
  }

  removeFromGroup(group) {
    this.props.removeFromGroup(this.props.user.toJS(), group);
  }

  renderGroups(error, loading, groups, actionRenderer) {
    if (!error && groups.length === 0) {
      return <div></div>;
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="30%">Name</TableColumn>
          <TableColumn width="60%">Description</TableColumn>
          <TableColumn width="10%" />
        </TableHeader>
        <TableBody>
        {groups.map((group, index) =>
          <TableRow key={index}>
            <TableIconCell color="green" icon="322" />
            <TableRouteCell route={`/groups/${group._id}`}>{ group.name || 'N/A' }</TableRouteCell>
            <TableTextCell>{group.description}</TableTextCell>
            <TableCell>
              {actionRenderer(group, index)}
            </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
    );
  }

  renderAllGroups(allGroups) {
    if (allGroups.records.length === 0) {
      return <div />;
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h3>All Group Memberships</h3>
            <span className="pull-left">The following table lists <strong>all</strong> group memberships for the user. This includes both explicit memberships and dynamic group memberships as the result of a mapping. <strong>Heads up:</strong> This list is cached for performance reasons and it could take a few seconds before changes are visible here.</span>
          </div>
        </div>
        <LoadingPanel show={allGroups.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={allGroups.error} />
          <Table>
            <TableHeader>
              <TableColumn width="3%" />
              <TableColumn width="97%">Name</TableColumn>
            </TableHeader>
            <TableBody>
            {allGroups.records.map((group, index) =>
              <TableRow key={index}>
                <TableIconCell color="green" icon="322" />
                <TableTextCell>{group}</TableTextCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </LoadingPanel>
      </div>
    );
  }

  render() {
    const groups = this.props.groups.toJS();
    const allGroups = this.props.allGroups.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h3>Explicit Group Memberships</h3>
            <span className="pull-left">{this.getHelpText(groups.records)}</span>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" bsSize="xsmall" onClick={this.addToGroup} disabled={groups.loading}>
                <i className="icon icon-budicon-337"></i> Add
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <LoadingPanel show={groups.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={groups.error} />
          {this.renderGroups(groups.error, groups.loading, groups.records, (group, index) => {
            return (
              <ButtonToolbar style={{ marginBottom: '0px' }}>
                <UserGroupRemoveAction index={index} group={group} loading={groups.loading} onRemove={this.removeFromGroup} />
              </ButtonToolbar>
            );
          })}
        </LoadingPanel>
        {this.renderAllGroups(allGroups)}
    </div>
    );
  }
}

UserGroups.propTypes = {
  addToGroup: PropTypes.func.isRequired,
  removeFromGroup: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  allGroups: PropTypes.object.isRequired
};

export default UserGroups;
