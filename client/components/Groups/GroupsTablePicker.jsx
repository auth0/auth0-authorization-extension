import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableHeader, TableColumn } from '@a0/auth0-extension-ui';

import GroupRowPicker from './GroupRowPicker';

class GroupsTablePicker extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.groups !== this.props.groups;
  }

  getRelevantGroups(all, selected) {
    if (!all || !all.length) {
      return [];
    }

    if (!selected || !selected.length) {
      return all;
    }

    const selectedIds = _.map(selected, group => group._id);
    return _.filter(all, group => !_.includes(selectedIds, group._id));
  }

  render() {
    const { groups, excludedGroups } = this.props;
    const relevantGroups = this.getRelevantGroups(groups.toJS(), excludedGroups);

    if (!relevantGroups.length) {
      return (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <p className="modal-description">There are no groups you can add right now.</p>
        </div>
      );
    }

    return (
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table>
          <TableHeader>
            <TableColumn width="5%" />
            <TableColumn width="45%">Name</TableColumn>
            <TableColumn width="50%">Description</TableColumn>
          </TableHeader>
          <TableBody>
            {_.sortBy(relevantGroups, 'name').map((group, index) =>
              <GroupRowPicker
                key={index}
                canOpenGroup={this.props.canOpenGroup}
                index={index}
                group={group}
                renderActions={this.props.renderActions}
                setNested={this.props.setNested}
              />
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

GroupsTablePicker.propTypes = {
  groups: PropTypes.object.isRequired,
  excludedGroups: PropTypes.object.isRequired,
  canOpenGroup: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  renderActions: PropTypes.func,
  setNested: PropTypes.func.isRequired
};

export default GroupsTablePicker;
