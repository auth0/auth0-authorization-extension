import React, { PropTypes } from 'react';

const Sidebar = ({ children }) => (
  <div id="sidebar" className="col-xs-2">
    <div className="sidebar-fixed">
      <ul>
        { children }
      </ul>
    </div>
  </div>
);

Sidebar.propTypes = {
  children: PropTypes.node
};

export default Sidebar;
