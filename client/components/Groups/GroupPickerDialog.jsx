import React, { Component } from 'react';

import './GroupPickerDialog.css';
import GroupsTable from './GroupsTable';
import { Error, Confirm, TableAction } from '../Dashboard';

class GroupPickerDialog extends Component {
  constructor() {
    super();

    this.renderActions = this.renderActions.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.groupPicker !== this.props.groupPicker;
  }

  renderActions(group, index) {
    return (
      <TableAction id={`select-group-${index}`} type="primary" title="Select Group" icon="299"
        onClick={this.props.onConfirm} args={[ group ]} disabled={this.props.groupPicker.get('loading') || false}
      />
    );
  }

  render() {
    const { onCancel } = this.props;
    const { title, error, open, loading } = this.props.groupPicker.toJS();

    return (
      <Confirm dialogClassName="group-picker-dialog" size="large" title={title} show={open} loading={loading} onCancel={onCancel}>
        <Error message={error} />
        <GroupsTable canOpenGroup={false} groups={this.props.groupPicker.get('records')} loading={loading} renderActions={this.renderActions} />
      </Confirm>
    );
  }
}

GroupPickerDialog.propTypes = {
  groupPicker: React.PropTypes.object.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired
};

export default GroupPickerDialog;
