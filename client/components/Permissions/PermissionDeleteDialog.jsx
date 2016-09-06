import React, { PropTypes, Component } from 'react';
import { Error, Confirm, LoadingPanel } from '../Dashboard';

export default class PermissionDeleteDialog extends Component {
  static propTypes = {
    permission: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.permission !== this.props.permission;
  }

  confirm = () => {
    this.props.onConfirm(this.props.permission.get('record').toJS());
  }

  clear = () => {
    this.props.onCancel();
  }

  render() {
    const permission = this.props.permission.toJS();
    const title = `Delete Permission: ${permission.record.name}`;

    return (
      <Confirm
        title={title} show={permission.requesting && permission.isDelete} loading={permission.loading}
        onCancel={this.clear} onConfirm={this.confirm}
      >
        <LoadingPanel
          show={permission.loading} spinnerStyle={{ height: '40px', width: '40px' }}
          animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}
        >
          <Error message={permission.error} />
          <p>Do you really want to delete "<strong>{ permission.record.name }</strong>"?</p>
        </LoadingPanel>
      </Confirm>
    );
  }
}
