import _ from 'lodash';
import React, { Component } from 'react';

import GroupRowPicker from './GroupRowPicker';
import { Table, TableBody, TableHeader, TableColumn } from 'auth0-extension-ui';

class GroupsTablePicker extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.groups !== this.props.groups;
  }

  render() {
    const groups = this.props.groups.toJS();

    return (
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table>
          <TableHeader>
            <TableColumn width="5%" onClick={() => { console.log('Select all records'); }}>
              <input type="checkbox" name="nested-groups" value="all" />
            </TableColumn>
            <TableColumn width="45%">Name</TableColumn>
            <TableColumn width="50%">Description</TableColumn>
          </TableHeader>
          <TableBody>
            {_.sortBy(groups, 'name').map((group, index) =>
              <GroupRowPicker key={index} canOpenGroup={this.props.canOpenGroup} index={index} group={group} renderActions={this.props.renderActions} />
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

GroupsTablePicker.propTypes = {
  groups: React.PropTypes.object.isRequired,
  canOpenGroup: React.PropTypes.bool,
  loading: React.PropTypes.bool.isRequired,
  renderActions: React.PropTypes.func.isRequired
};

export default GroupsTablePicker;
