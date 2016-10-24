import React, { Component } from 'react';

import './GroupPickerDialog.styl';
import GroupsTablePicker from './GroupsTablePicker';
import { Error, Confirm, TableAction, LoadingPanel } from 'auth0-extension-ui';

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
      <TableAction
        id={`select-group-${index}`} type="primary" title="Select Group" icon="299"
        onClick={this.props.onConfirm} args={[ group ]} disabled={this.props.groupPicker.get('loading') || false}
      />
    );
  }

  render() {
    const { onCancel } = this.props;
    const { title, error, open, loading } = this.props.groupPicker.toJS();

    return (
      <Confirm
        dialogClassName="group-picker-dialog" size="large" title={title} show={open}
        loading={loading} onCancel={onCancel} onConfirm={() => { console.log('confirm'); }} confirmMessage="Add"
      >
        <Error message={error} />
        <p className="modal-description">
          Select the groups you want to add as nested groups.
          <br />
          All members of the selected groups will become members of this group also.
        </p>
        <LoadingPanel show={loading}>
          <GroupsTablePicker
            canOpenGroup={false} groups={this.props.groupPicker.get('records')}
            loading={loading}
          />
        </LoadingPanel>
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
