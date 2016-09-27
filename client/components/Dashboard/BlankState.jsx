import React, { Component, PropTypes } from 'react';
import './BlankState.styl';

class BlankState extends Component {
  render() {
    const { title, iconImage, description } = this.props;
    return (
      <div className="no-content-section">
        <h2 className="title">{title}</h2>
        { iconImage }
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
  iconImage: PropTypes.node,
  description: PropTypes.string,
  children: PropTypes.node
};

export default BlankState;
