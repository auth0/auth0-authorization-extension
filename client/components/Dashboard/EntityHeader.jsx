import React, { PropTypes } from 'react';
import './EntityHeader.styl';

const EntityHeader = ({ imgSource, primaryText, secondaryText, children }) => (
  <div className={`entity-header ${imgSource && 'with-image'}`}>
    { imgSource && <img src={imgSource} alt="" className="entity-header-avatar" /> }
    <div className="entity-header-content">
      <h2 className="entity-header-primary">{primaryText}</h2>
      { secondaryText && <h5 className="entity-header-secondary">{secondaryText}</h5> }
    </div>
    { children &&
      <div className="entity-header-actions">
        { children }
      </div>
    }
  </div>
);

EntityHeader.propTypes = {
  imgSource: PropTypes.string,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  children: PropTypes.node
};

export default EntityHeader;
