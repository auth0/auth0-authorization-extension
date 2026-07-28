import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, useMatch } from 'react-router-dom';

// The published @a0/auth0-extension-ui SidebarItem still reads
// this.context.router.isActive() (react-router 2/3 legacy context), which no
// longer exists in react-router-dom 6 and throws. This is a drop-in leaf-item
// replacement that reproduces the original markup (active class on the <li>)
// using RR6's useMatch. The app only ever uses leaf items (no submenu).
const SidebarNavItem = ({ icon, title, route }) => {
  const match = useMatch({ path: route, end: false });
  const className = classNames('sidebar-item', { active: !!match });

  return (
    <li className={className}>
      <Link to={route}>
        <div className="item-image-container">{icon}</div>
        <span>{title}</span>
      </Link>
    </li>
  );
};

SidebarNavItem.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired
};

export default SidebarNavItem;
