import React, { Component } from 'react';
import { Error, Confirm, LoadingPanel } from '../Dashboard';

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
      <Confirm title={ title } show={ group.requesting && group.isDelete } loading={ group.loading } 
        onCancel={ this.clear } onConfirm={ this.confirm }>
        <LoadingPanel show={ group.loading } spinnerStyle={{ height: '40px', width: '40px' }}
            animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={ group.error } />
          <p>
            Do you really want to delete "<strong>{ group.record.name }</strong>"? 
            This means all group memberships will also be removed.
          </p>
        </LoadingPanel>
      </Confirm>
    );
  }
}

GroupDeleteDialog.propTypes = {
  group: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
};

export default GroupDeleteDialog;
