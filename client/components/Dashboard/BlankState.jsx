import React, { Component, PropTypes } from 'react';
import './BlankState.styl';

class BlankState extends Component {
  render() {
    const { title, iconCode, description } = this.props;
    return (
      <div className="no-content-section">
        <h2 className="title">{title}</h2>
        { iconCode && <i className={`icon-budicon-${iconCode} section-icon`} /> }
        { description && <p className="description">{description}</p> }
        <div className="button-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

BlankState.propTypes = {
  title: PropTypes.string.isRequired,
  iconCode: PropTypes.number.isRequired,
  description: PropTypes.string,
  children: React.PropTypes.node
};

export default BlankState;
