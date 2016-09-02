import React, { Component } from 'react';
import './UserHeader.styl';
import EntityHeader from '../Dashboard/EntityHeader';

class UserHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  getEmail(user) {
    if (!user.email) return null;
    return user.email;
  }

  render() {
    if (this.props.error) return null;

    const user = this.props.user.toJS();

    return (
      <EntityHeader
        imgSource={user.picture}
        primaryText={user.name || user.nickname || user.email}
        secondaryText={this.getEmail(user)}
      />
    );
  }
}

UserHeader.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object.isRequired
};

export default UserHeader;
