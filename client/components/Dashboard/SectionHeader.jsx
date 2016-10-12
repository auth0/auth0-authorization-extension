import React, { PropTypes } from 'react';
import './SectionHeader.styl';

const SectionHeader = ({ children, title, description, isSubsection }) => (
  <div className={`extension-section-header row ${isSubsection ? 'is-subsection' : ''}`}>
    <div className="col-xs-12">
      <div className="title-container">
        <h2 className="title">{title}</h2>
        { children ?
          <div className="buttons-container">
            { children }
          </div> : null }
      </div>
      { description ? <p className="description">{description}</p> : null }
    </div>
  </div>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  isSubsection: PropTypes.bool,
  children: PropTypes.node
};

export default SectionHeader;
