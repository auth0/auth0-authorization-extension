import React, { Component, PropTypes } from 'react';
import { TableAction } from 'auth0-extension-ui';

class GroupMemberRemoveAction extends Component {
  constructor() {
    super();
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove() {
    this.props.onRemove(this.props.user);
  }

  render() {
    const { index, loading } = this.props;
    return (
      <TableAction id={`remove-user-${index}`} type="success" title="Remove" icon="296"
        onClick={this.onRemove} disabled={loading || false}
      />
    );
  }
}

GroupMemberRemoveAction.propTypes = {
  user: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onRemove: PropTypes.func.isRequired
};

export default GroupMemberRemoveAction;
