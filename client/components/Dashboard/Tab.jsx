import React, { PropTypes } from 'react';

const Tab = ({ children }) => (
  <div className="row">
    <div className="col-xs-12 wrapper">
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
          { children }
        </ul>
      </div>
    </div>
  </div>
);

Tab.propTypes = {
  children: PropTypes.node
};

export default Tab;
