import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import UserGroupRemoveAction from './UserGroupRemoveAction';
import { Error, LoadingPanel, Table, TableCell, TableRouteCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';

class UserGroups extends Component {
  constructor() {
    super();

    this.state = {
      showUserGroups: true
    };

    this.addToGroup = this.addToGroup.bind(this);
    this.removeFromGroup = this.removeFromGroup.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.user !== this.props.user ||
    nextProps.groups !== this.props.groups ||
    nextProps.allGroups !== this.props.allGroups ||
    nextState.showUserGroups !== this.state.showUserGroups;
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

  toggleShowUserGroups = () => {
    this.setState({
      showUserGroups: !this.state.showUserGroups
    });
  }

  renderGroups(error, loading, groups, showIcon, actionRenderer) {
    if (!error && groups.length === 0) {
      return null;
    }

    return (
      <Table>
        <TableHeader>
          { showIcon ? <TableColumn width="3%" /> : null }
          <TableColumn width="30%">Name</TableColumn>
          <TableColumn width="60%">Description</TableColumn>
          { showIcon ? <TableColumn width="7%" /> : <TableColumn width="10%" /> }
        </TableHeader>
        <TableBody>
        {groups.map((group, index) =>
          <TableRow key={index}>
            { showIcon ? <TableIconCell color="green" icon="322" /> : null }
            <TableRouteCell route={`/groups/${group._id}`}>{ group.name || 'N/A' }</TableRouteCell>
            <TableTextCell>{group.description}</TableTextCell>
            <TableCell style={{ paddingRight: 0, textAlign: 'right' }}>
              { actionRenderer ? actionRenderer(group, index) : null }
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
            <span className="pull-left">The following table lists <strong>all</strong> group memberships for the user. This includes both explicit memberships and dynamic group memberships as the result of a mapping. <strong>Heads up:</strong> This list is cached for performance reasons and it could take a few seconds before changes are visible here.</span>
          </div>
        </div>
        { this.renderGroups(allGroups.error, allGroups.loading, allGroups.records, true) }
      </div>
    );
  }

  renderUserGroups(groups) {
    return (
      <div>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-8">
            <p>{this.getHelpText(groups.records)}</p>
          </div>
          <div className="col-xs-4">
            <Button className="pull-right" bsStyle="success" onClick={this.addToGroup} disabled={groups.loading}>
              <i className="icon icon-budicon-473" /> Add user to groups
            </Button>
          </div>
        </div>
        { this.renderGroups(groups.error, groups.loading, groups.records, false, (group, index) => (
          <UserGroupRemoveAction index={index} group={group} loading={groups.loading} onRemove={this.removeFromGroup} />
        )) }
      </div>
    );
  }

  render() {
    const groups = this.props.groups.toJS();
    const allGroups = this.props.allGroups.toJS();

    return (
      <div>
        <LoadingPanel show={groups.loading || allGroups.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>

          <div className="row">
            <div className="col-xs-12">
              <Error message={groups.error || allGroups.error} />
            </div>
          </div>
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-xs-12">
              <ul className="nav nav-pills">
                <li className={this.state.showUserGroups ? 'active' : null} >
                  <a onClick={this.toggleShowUserGroups}>Groups</a>
                </li>
                <li className={!this.state.showUserGroups ? 'active' : null}>
                  <a onClick={this.toggleShowUserGroups}>Nested Groups</a>
                </li>
              </ul>
            </div>
          </div>
          { this.state.showUserGroups ?
            this.renderUserGroups(groups) :
            this.renderAllGroups(allGroups) }
        </LoadingPanel>
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
