import React, { Component, PropTypes } from 'react';
import { TableAction } from '../Dashboard';

class NestedGroupRemoveAction extends Component {
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
      <TableAction id={`remove-group-${index}`} type="success" title="Remove" icon="296"
        onClick={this.onRemove} disabled={loading || false}
      />
    );
  }
}

NestedGroupRemoveAction.propTypes = {
  group: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onRemove: PropTypes.func.isRequired
};

export default NestedGroupRemoveAction;
