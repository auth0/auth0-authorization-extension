import React, { Component } from 'react';
import { Error, Confirm, LoadingPanel } from '../Dashboard';

class GroupMemberRemoveDialog extends Component {
  constructor() {
    super();
    this.confirm = this.confirm.bind(this);
    this.clear = this.clear.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.groupMember !== this.props.groupMember;
  }

  confirm() {
    this.props.onConfirm(this.props.groupMember.get('groupId'), this.props.groupMember.get('userId'));
  }

  clear() {
    this.props.onCancel();
  }

  render() {
    const { requesting, isRemove, error, loading, groupName, userDisplayName } = this.props.groupMember.toJS();
    const title = `Remove user from ${groupName}`;

    return (
      <Confirm title={title} show={requesting && isRemove} loading={loading} onCancel={this.clear} onConfirm={this.confirm} confirmMessage="Remove">
        <LoadingPanel show={loading} spinnerStyle={{ height: '40px', width: '40px' }} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error} />
          <p style={{ textAlign: 'center' }}>Do you really want to remove <strong>{ userDisplayName }</strong> from <strong>{ groupName }</strong>?</p>
        </LoadingPanel>
      </Confirm>
    );
  }
}

GroupMemberRemoveDialog.propTypes = {
  groupMember: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
};

export default GroupMemberRemoveDialog;
