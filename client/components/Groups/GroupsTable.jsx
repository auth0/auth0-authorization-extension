import _ from 'lodash';
import React, { Component } from 'react';

import GroupRow from './GroupRow';
import { Table, TableBody, TableHeader, TableColumn } from '../Dashboard';

class GroupsTable extends Component {
  constructor() {
    super();
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);    
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.groups !== this.props.groups || nextProps.applications !== this.props.applications;
  }
  
  edit(group) {
    this.props.onEdit(group);
  }
  
  delete(group) {
    this.props.onDelete(group);
  }

  render() {
    const groups = this.props.groups.toJS();

    return <Table>
      <TableHeader>
        <TableColumn width="3%"></TableColumn>
        <TableColumn width="27%">Name</TableColumn>
        <TableColumn width="55%">Description</TableColumn>
        <TableColumn width="15%"></TableColumn>
      </TableHeader>
      <TableBody>
        {_.sortBy(groups, 'name').map((group, index) => 
          <GroupRow key={index} group={group} onEdit={this.edit} onDelete={this.delete} />
        )}
      </TableBody>
    </Table>;
  }
}

GroupsTable.propTypes = {
  onEdit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  groups: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default GroupsTable;
