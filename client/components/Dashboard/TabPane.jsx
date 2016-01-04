import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class TabPane extends Component {
  render() {
    const linkClass = classNames({
      'active': this.context.history.isActive(this.props.route)
    });
    return (
      <li className={linkClass}>
        <Link className="script-button" to={`/${this.props.route}`} aria-expanded="true">
          <span className="tab-title">{this.props.title}</span>
        </Link>
      </li>);
  }
}

TabPane.propTypes = {
  route: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};

TabPane.contextTypes = {
  history: React.PropTypes.object.isRequired
};

export default TabPane;
