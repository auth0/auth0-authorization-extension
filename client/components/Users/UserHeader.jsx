import React, { Component } from 'react';

class UserHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  getEmail(user) {
    if (!user.email) {
      return <div></div>;
    }

    return <span className="user-label user-head-email">{ user.email }</span>;
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }

    const user = this.props.user.toJS();

    return <div className="user-header">
      <img className="img-polaroid" src={user.picture} />
        <div className="user-bg-box" style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
          <img className="user-bg" src={user.picture} />
          <div className="box-content">
            <div className="login-count">
              <span className="lined-text">Logins Count:</span>
              <strong>{user.logins_count || 0}</strong>
            </div>
            <div className="username-area">
              <h4>
                <span className="name user-head-nickname">
                  { user.name || user.nickname || user.email }
                </span>
                {this.getEmail(user)}
              </h4>
            </div>
          </div>
      </div>
    </div>;
  }
}

UserHeader.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object.isRequired
};

export default UserHeader;
