import React, { Component } from 'react';
import { Error, Confirm } from '../Dashboard';

class RemoveMultiFactorDialog extends Component {
  render() {
    const { userName, error, requesting, loading, onCancel, onConfirm } = this.props;
    return <Confirm title="Remove Multi Factor Authentication?" show={requesting} loading={loading} onCancel={onCancel} onConfirm={onConfirm}>
        <Error message={error} />
        <p>Do you really want to remove the multi factor authentication settings for <strong>{userName}</strong>? This will allow the user to authenticate and reconfigure a new device.</p>
      </Confirm>;
  }
}

RemoveMultiFactorDialog.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool.isRequired,
  requesting: React.PropTypes.bool.isRequired,
  userName: React.PropTypes.string,
  error: React.PropTypes.string
};

export default RemoveMultiFactorDialog;
