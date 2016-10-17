import React, { PropTypes } from 'react';
import './BlankState.styl';

const BlankState = ({ children, title, iconImage, description }) => (
  <div className="no-content-section">
    <h2 className="title">{title}</h2>
    { iconImage }
    { description && <p className="description">{description}</p> }
    <div className="button-container">
      {children}
    </div>
  </div>
);

BlankState.propTypes = {
  title: PropTypes.string.isRequired,
  iconImage: PropTypes.node,
  description: PropTypes.string,
  children: PropTypes.node
};

export default BlankState;
