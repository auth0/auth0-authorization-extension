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
    return nextProps.user !== this.props.user || nextProps.groups !== this.props.groups;
  }

  getHelpText(groups) {
    if (groups.length === 0) {
      return <span>This user does not belong to any groups.</span>;
    }

    return <span>These are the explicit group memberships of the user.<br /> Group memberships as the result of a group mapping will not be listed here.</span>;
  }

  addToGroup() {
    this.props.addToGroup(this.props.user.toJS());
  }

  removeFromGroup(group) {
    this.props.removeFromGroup(this.props.user.toJS(), group);
  }

  renderGroups(error, loading, groups) {
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
              <ButtonToolbar style={{ marginBottom: '0px' }}>
                <UserGroupRemoveAction index={index} group={group} loading={loading} onRemove={this.removeFromGroup} />
              </ButtonToolbar>
            </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
    );
  }

  render() {
    const { error, loading, records } = this.props.groups.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <span className="pull-left">{this.getHelpText(records)}</span>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" bsSize="xsmall" onClick={this.addToGroup} disabled={loading}>
                <i className="icon icon-budicon-337"></i> Add
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error} />
          {this.renderGroups(error, loading, records)}
        </LoadingPanel>
    </div>
    );
  }
}

UserGroups.propTypes = {
  addToGroup: PropTypes.func.isRequired,
  removeFromGroup: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired
};

export default UserGroups;
