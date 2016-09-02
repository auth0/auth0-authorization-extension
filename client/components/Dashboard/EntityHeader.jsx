import React from 'react';
import './EntityHeader.styl';

const EntityHeader = ({ imgSource, primaryText, secondaryText, children }) => {
  return (
    <div className="entity-header">
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
};

EntityHeader.propTypes = {
  imgSource: React.PropTypes.string,
  primaryText: React.PropTypes.string.isRequired,
  secondaryText: React.PropTypes.string,
  children: React.PropTypes.node
};

export default EntityHeader;
