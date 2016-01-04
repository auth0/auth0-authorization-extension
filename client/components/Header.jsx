import './Header.css';
import React, { Component } from 'react';

class Header extends Component {
  render() {
    const { user, onLogout } = this.props;
    return <header className="dashboard-header" style={{ backgroundColor: '#fbfbfb' }}>
      <nav role="navigation" className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Identity & Access Management</a>
          </div>
          <div id="navbar-collapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <span role="button" data-toggle="dropdown" data-target="#" className="btn-dro btn-username">
                  <img src={user.get('picture')} className="picture avatar" />
                  <span className="username-text truncate">
                    {user.get('nickname') || user.get('email')}
                  </span>
                  <i className="icon-budicon-460"></i>
                </span>
                <ul role="menu" className="dropdown-menu">
                  <li role="presentation">
                    <a href="#" role="menuitem" tabIndex="-1" onClick={onLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>;
  }
}

Header.propTypes = {
  user: React.PropTypes.object,
  onLogout: React.PropTypes.func.isRequired
};

export default Header;
