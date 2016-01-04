import React, { Component } from 'react';
import { Error, Confirm } from '../Dashboard';

class BlockUserDialog extends Component {
  render() {
    const { userName, error, requesting, loading, onCancel, onConfirm } = this.props;
    return <Confirm title="Block User?" show={requesting} loading={loading} onCancel={onCancel} onConfirm={onConfirm}>
        <Error message={error} />
        <p>Do you really want to block <strong>{userName}</strong>? This means the user will not be able to sign in anymore.</p>
      </Confirm>;
  }
}

BlockUserDialog.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool.isRequired,
  requesting: React.PropTypes.bool.isRequired,
  userName: React.PropTypes.string,
  error: React.PropTypes.string
};

export default BlockUserDialog;
