import React, { Component } from 'react';
import { Error, Confirm, LoadingPanel } from '../Dashboard';

class NestedGroupRemoveDialog extends Component {
  constructor() {
    super();
    this.confirm = this.confirm.bind(this);
    this.clear = this.clear.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.groupNested !== this.props.groupNested;
  }

  confirm() {
    this.props.onConfirm(this.props.groupNested.get('groupId'), this.props.groupNested.get('nestedGroupId'));
  }

  clear() {
    this.props.onCancel();
  }

  render() {
    const { requesting, isRemove, error, loading, groupName, nestedGroupName } = this.props.groupNested.toJS();
    const title = `Remove nested group '${nestedGroupName}' from '${groupName}'`;

    return (
      <Confirm title={ title } show={ requesting && isRemove } loading={ loading } onCancel={ this.clear } onConfirm={ this.confirm }>
        <LoadingPanel show={ loading } spinnerStyle={{ height: '40px', width: '40px' }} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={ error } />
          <p>Do you really want to remove <strong>{ nestedGroupName }</strong> from <strong>{ groupName }</strong>?</p>
        </LoadingPanel>
      </Confirm>
    );
  }
}

NestedGroupRemoveDialog.propTypes = {
  groupNested: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
};

export default NestedGroupRemoveDialog;
