import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class SidebarItem extends Component {
  render() {
    const linkClass = classNames({
      'active': this.context.history.isActive(this.props.route)
    });
    return (
      <li className={linkClass}>
        <Link to={`${this.props.route}`}>
          <i className={this.props.icon}></i> <span>{this.props.title}</span>
        </Link>
      </li>);
  }
}

SidebarItem.propTypes = {
  route: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired
};

SidebarItem.contextTypes = {
  history: React.PropTypes.object.isRequired
};

export default SidebarItem;
