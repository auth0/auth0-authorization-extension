import './Header.css';
import React, { Component } from 'react';

class Header extends Component {
  render() {
    const { user, onLogout } = this.props;
    return <header className="dashboard-header" style={{ backgroundColor: '#fbfbfb' }}>
      <nav role="navigation" className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <img src="http://cdn.auth0.com/extensions/auth0-groups/assets/app_logo.svg" style={{float: 'left', minWidth: '55px', minHeight: '55px', display: 'block', marginRight: '15px'}}></img>
            <a className="navbar-brand" href="#" style={{width: '50%'}}>Groups</a>
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
