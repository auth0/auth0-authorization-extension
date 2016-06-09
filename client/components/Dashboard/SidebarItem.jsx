import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class SidebarItem extends Component {
  state = {
    open: false
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
            <i className={this.props.icon}></i> <span>{this.props.title}</span></a>
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
          <i className={this.props.icon}></i> <span>{this.props.title}</span>
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
