import React, { Component } from 'react';
import './UserHeader.styl';

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
      <div className="user-header">
        <img src={user.picture} alt="" className="user-header-avatar" />
        <div className="user-header-content">
          <h2 className="user-header-primary">{ user.name || user.nickname || user.email }</h2>
          <h5 className="user-header-secondary">{this.getEmail(user)}</h5>
        </div>
      </div>
    );
  }
}

UserHeader.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object.isRequired
};

export default UserHeader;
