import './Header.css';
import React, { Component } from 'react';

class Header extends Component {
  render() {
    const { user, issuer, onLogout, openConfiguration } = this.props;
    return <header className="extension-header">
      <nav role="navigation" className="navbar navbar-default">
        <div className="container">
          <div className="extension-header-logo">
            <div className="auth0-logo"></div>
            <h1 className="extension-name">Authorization Extension</h1>
          </div>
          <div id="navbar-collapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>Help</li>
              <li>Dashboard</li>
              <li className="dropdown">
                <span role="button" data-toggle="dropdown" data-target="#" className="btn-username">
                  <img src={user.get('picture')} className="avatar" />
                  <span className="username-text">
                    { issuer || user.get('nickname') || user.get('email')}
                  </span>
                  <i className="icon-budicon-460 toggle-icon"></i>
                </span>
                <ul role="menu" className="dropdown-menu">
                  <li role="presentation">
                    <a href="#" role="menuitem" tabIndex="-1" onClick={openConfiguration}>
                      Configuration
                    </a>
                  </li>
                  <li role="presentation" className="divider"></li>
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
  issuer: React.PropTypes.string,
  onLogout: React.PropTypes.func.isRequired,
  openConfiguration: React.PropTypes.func.isRequired
};

export default Header;
