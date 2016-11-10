import React, { Component, PropTypes } from 'react';
import './Header.styl';

export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    issuer: PropTypes.string,
    onLogout: PropTypes.func.isRequired,
    openConfiguration: PropTypes.func.isRequired
  }

  getPicture(iss) {
    return `https://cdn.auth0.com/avatars/${iss.slice(0, 2).toLowerCase()}.png`;
  }

  render() {
    const { user, issuer, onLogout, openConfiguration } = this.props;
    return (<header className="extension-header">
      <nav role="navigation" className="navbar navbar-default">
        <div className="container">
          <div className="extension-header-logo">
            <div className="auth0-logo" />
            <h1 className="extension-name">Authorization Extension</h1>
          </div>
          <div id="navbar-collapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="https://auth0.com/docs/extensions/authorization-extension">Help</a>
              </li>
              <li>
                <a href="https://manage.auth0.com/">Dashboard</a>
              </li>
              <li className="dropdown">
                <span role="button" data-toggle="dropdown" data-target="#" className="btn-username">
                  <img src={this.getPicture(issuer)} className="avatar" />
                  <span className="username-text">
                    { issuer || user.get('nickname') || user.get('email')}
                  </span>
                  <i className="icon-budicon-460 toggle-icon" />
                </span>
                <ul role="menu" className="dropdown-menu">
                  <li role="presentation">
                    <a role="menuitem" tabIndex="-1" onClick={openConfiguration}>
                      Configuration
                    </a>
                  </li>
                  <li role="presentation" className="divider" />
                  <li role="presentation">
                    <a role="menuitem" tabIndex="-1" onClick={onLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>);
  }
}
