import React, { Component, PropTypes } from 'react';

import { TableAction } from 'auth0-extension-ui';

class UserPickerUnselectAction extends Component {
  constructor() {
    super();
    this.onUnselect = this.onUnselect.bind(this);
  }

  onUnselect() {
    this.props.onUnselect(this.props.user);
  }

  render() {
    const { index, loading } = this.props;
    return (
      <TableAction id={`unselect-user-${index}`} type="success" title="Unselect" icon="296"
        onClick={this.onUnselect} disabled={loading || false}
      />
    );
  }
}

UserPickerUnselectAction.propTypes = {
  user: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onUnselect: PropTypes.func.isRequired
};

export default UserPickerUnselectAction;
