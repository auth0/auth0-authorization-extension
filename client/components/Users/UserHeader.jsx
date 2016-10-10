import React, { Component } from 'react';
import EntityHeader from '../Dashboard/EntityHeader';

class UserHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user;
  }

  render() {
    if (this.props.error) return null;

    const user = this.props.user.toJS();

    return (
      <EntityHeader
        imgSource={user.picture}
        primaryText={user.name || user.nickname || user.email}
        secondaryText={user.email}
      />
    );
  }
}

UserHeader.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default UserHeader;
