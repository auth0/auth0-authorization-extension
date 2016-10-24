import React, { Component, PropTypes } from 'react';
import { TableAction } from 'auth0-extension-ui';

class GroupMappingRemoveAction extends Component {
  constructor() {
    super();
    this.onRemove = this.onRemove.bind(this);
  }

  onRemove() {
    this.props.onRemove(this.props.groupMapping);
  }

  render() {
    const { index, loading } = this.props;
    return (
      <TableAction id={`remove-groupMapping-${index}`} type="success" title="Remove" icon="264"
        onClick={this.onRemove} disabled={loading || false}
      />
    );
  }
}

GroupMappingRemoveAction.propTypes = {
  groupMapping: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onRemove: PropTypes.func.isRequired
};

export default GroupMappingRemoveAction;
