import React, { Component } from 'react';
import { Error, Confirm, LoadingPanel } from 'auth0-extension-ui';

class GroupMappingRemoveDialog extends Component {
  constructor() {
    super();
    this.confirm = this.confirm.bind(this);
    this.clear = this.clear.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.groupMapping !== this.props.groupMapping || nextProps.group !== this.props.group;
  }

  confirm() {
    this.props.onConfirm(this.props.group.get('groupId'), this.props.groupMapping.get('groupMappingId'));
  }

  clear() {
    this.props.onCancel();
  }

  render() {
    const group = this.props.group.toJS();
    const { requesting, isDelete, error, loading, record } = this.props.groupMapping.toJS();

    const title = `Remove mapping from ${group.record.name}`;
    return (
      <Confirm title={title} show={requesting && isDelete} loading={loading} onCancel={this.clear} onConfirm={this.confirm}>
        <LoadingPanel show={loading} spinnerStyle={{ height: '40px', width: '40px' }} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error} />
          <p>Do you really want to remove the following mapping from <strong>{ group.record.name }</strong>?</p>
          <p><strong>{ record.connectionName }</strong> / <strong>{ record.groupName }</strong></p>
        </LoadingPanel>
      </Confirm>
    );
  }
}

GroupMappingRemoveDialog.propTypes = {
  group: React.PropTypes.object.isRequired,
  groupMapping: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
};

export default GroupMappingRemoveDialog;
