import React, { Component, PropTypes } from 'react';

import { TableAction } from 'auth0-extension-ui';

class UserPickerSelectAction extends Component {
  constructor() {
    super();
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect() {
    this.props.onSelect(this.props.user);
  }

  render() {
    const { index, loading } = this.props;
    return (
      <TableAction
        id={`select-user-${index}`} type="primary" title="Select" icon="299"
        onClick={this.onSelect} disabled={loading || false}
      />
    );
  }
}

UserPickerSelectAction.propTypes = {
  user: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};

export default UserPickerSelectAction;
