import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TableAction } from '@a0/auth0-extension-ui';

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
      <TableAction
        id={`remove-groupMapping-${index}`} title="Remove" icon="471"
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
