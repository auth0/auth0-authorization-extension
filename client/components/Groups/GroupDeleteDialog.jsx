import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Error, Confirm, LoadingPanel } from '@a0/auth0-extension-ui';

class GroupDeleteDialog extends Component {
  constructor() {
    super();
    this.confirm = this.confirm.bind(this);
    this.clear = this.clear.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group;
  }

  confirm() {
    this.props.onConfirm(this.props.group.get('record').toJS());
  }

  clear() {
    this.props.onCancel();
  }

  render() {
    const group = this.props.group.toJS();
    const title = `Delete Group: ${group.record.name}`;

    return (
      <Confirm
        title={title} show={group.requesting && group.isDelete} loading={group.loading}
        onCancel={this.clear} onConfirm={this.confirm} confirmMessage="Delete"
      >
        <LoadingPanel
          show={group.loading} spinnerStyle={{ height: '40px', width: '40px' }}
          animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}
        >
          <Error message={group.error} />
          <p className="text-center">
            Do you really want to delete "<strong>{ group.record.name }</strong>"? <br />
            This means all group mappings and memberships will also be removed.
          </p>
        </LoadingPanel>
      </Confirm>
    );
  }
}

GroupDeleteDialog.propTypes = {
  group: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default GroupDeleteDialog;
