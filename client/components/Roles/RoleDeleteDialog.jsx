import React, { PropTypes, Component } from 'react';
import { Error, Confirm, LoadingPanel } from 'auth0-extension-ui';

export default class RoleDeleteDialog extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.role !== this.props.role;
  }

  confirm = () => {
    this.props.onConfirm(this.props.role.get('record').toJS());
  }

  clear = () => {
    this.props.onCancel();
  }

  render() {
    const role = this.props.role.toJS();
    const title = `Delete Role: ${role.record.name}`;

    return (
      <Confirm
        title={title} show={role.requesting && role.isDelete} loading={role.loading}
        onCancel={this.clear} onConfirm={this.confirm} confirmMessage="Delete"
      >
        <LoadingPanel
          show={role.loading} spinnerStyle={{ height: '40px', width: '40px' }}
          animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}
        >
          <Error message={role.error} />
          <p className="text-center">Do you really want to delete "<strong>{ role.record.name }</strong>"?</p>
        </LoadingPanel>
      </Confirm>
    );
  }
}
