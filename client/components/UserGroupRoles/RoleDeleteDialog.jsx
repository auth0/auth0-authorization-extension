import React, { PropTypes, Component } from 'react';
import { Error, Confirm, LoadingPanel } from 'auth0-extension-ui';

export default class RoleDeleteDialog extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  confirm = () => {
    this.props.onConfirm(this.props.role);
  }

  clear = () => {
    this.props.onCancel();
  }

  render() {
    const role = this.props.role;
    const title = `Delete Role: ${role.name}`;
    const { loading, error, deleting } = this.props;
    return (
      <Confirm
        title={title} show={deleting} loading={loading}
        onCancel={this.clear} onConfirm={this.confirm} confirmMessage="Delete"
      >
        <LoadingPanel
          show={loading} spinnerStyle={{ height: '40px', width: '40px' }}
          animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}
        >
          <Error message={error} />
          <p className="text-center">Do you really want to delete "<strong>{ role.name }</strong>"?</p>
        </LoadingPanel>
      </Confirm>
    );
  }
}
