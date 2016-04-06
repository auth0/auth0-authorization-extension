import _ from 'lodash';
import React, { Component } from 'react';

import GroupRow from './GroupRow';
import { Table, TableBody, TableHeader, TableColumn } from '../Dashboard';

class GroupsTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.groups !== this.props.groups;
  }

  render() {
    const groups = this.props.groups.toJS();

    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="15%">Name</TableColumn>
          <TableColumn width="28%">Description</TableColumn>
          <TableColumn>Members</TableColumn>
          <TableColumn>Nested</TableColumn>
          <TableColumn>Mappings</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody>
          {_.sortBy(groups, 'name').map((group, index) =>
            <GroupRow key={index} canOpenGroup={this.props.canOpenGroup} index={index} group={group} renderActions={this.props.renderActions} />
          )}
        </TableBody>
      </Table>
    );
  }
}

GroupsTable.propTypes = {
  groups: React.PropTypes.object.isRequired,
  canOpenGroup: React.PropTypes.bool,
  loading: React.PropTypes.bool.isRequired,
  renderActions: React.PropTypes.func.isRequired
};

export default GroupsTable;
