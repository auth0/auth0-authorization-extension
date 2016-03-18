import React, { Component, PropTypes } from 'react';
import { TableAction } from '../Dashboard';

class UserGroupRemoveAction extends Component {
  constructor() {
    super();
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove() {
    this.props.onRemove(this.props.group);
  }

  render() {
    const { index, loading } = this.props;
    return (
      <TableAction id={`remove-group-${index}`} type="success" title="Remove" icon="263"
        onClick={this.onRemove} disabled={loading || false}
      />
    );
  }
}

UserGroupRemoveAction.propTypes = {
  group: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onRemove: PropTypes.func.isRequired
};

export default UserGroupRemoveAction;
