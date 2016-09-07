import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import './SidebarItem.styl';

import usersIcon from './svg/User.svg';
import groupsIcon from './svg/Groups.svg';
import rolesIcon from './svg/Roles.svg';
import permissionsIcon from './svg/Permissions.svg';

const sidebarIcons = {
  users: usersIcon,
  groups: groupsIcon,
  roles: rolesIcon,
  permissions: permissionsIcon
};

class SidebarItem extends Component {
  state = {
    open: false,
    active: false
  }

  componentWillReceiveProps(nextProps) {
    let open = this.state.open;
    const active = this.context.router.isActive(nextProps.route);
    if (!active && this.state.active) {
      open = false;
    }
    this.setState({
      active,
      open: open || active
    });
  }

  onClick = () => {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { route, children } = this.props;

    if (children && children.length) {
      const groupClass = classNames({
        submenu: true,
        open: this.state.open,
        active: this.context.router.isActive(this.props.route)
      });

      return (
        <li className={groupClass}>
          <a href="#" onClick={this.onClick}>
            <div className="item-image-container">
              <img className="item-image" src={sidebarIcons[this.props.icon]} role="presentation" />
            </div>
            <span>{this.props.title}</span>
          </a>
          <ul style={{ display: this.state.open ? 'block' : 'none' }}>
            {children}
          </ul>
        </li>
      );
    }

    const linkClass = classNames({
      active: this.context.router.isActive(this.props.route)
    });
    return (
      <li className={linkClass}>
        <Link to={`${this.props.route}`}>
          <div className="item-image-container">
            <img className="item-image" src={sidebarIcons[this.props.icon]} role="presentation" />
          </div>
          <span>{this.props.title}</span>
        </Link>
      </li>
    );
  }
}

SidebarItem.propTypes = {
  route: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired
};

SidebarItem.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default SidebarItem;
