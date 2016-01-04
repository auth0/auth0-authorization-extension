import React, { Component } from 'react';
import { Error, Confirm } from '../Dashboard';

class DeleteGroupDialog extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group;
  }

  render() {
    const group = this.props.group.toJS();
    return (
      <Confirm title="Delete Group?" show={group.requesting && group.isDelete} loading={group.loading} onCancel={this.props.onCancel} onConfirm={this.props.onConfirm}>
        <Error message={group.error} />
        <p>Do you really want to delete <strong>{group.groupId}</strong>? This means the group will also be removed from any possible role.</p>
      </Confirm>
    );
  }
}

DeleteGroupDialog.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  group: React.PropTypes.object.isRequired
};

export default DeleteGroupDialog;
