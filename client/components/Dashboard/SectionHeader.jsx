import React, { Component, PropTypes } from 'react';
import './SectionHeader.styl';

export default class SectionHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    isSubsection: PropTypes.bool,
    children: PropTypes.node
  }

  render() {
    const { title, description, isSubsection } = this.props;
    return (
      <div className={`extension-section-header row ${isSubsection ? 'is-subsection' : ''}`}>
        <div className="col-xs-12">
          <div className="title-container">
            <h2 className="title">{title}</h2>
            { this.props.children ?
              <div className="buttons-container">
                {this.props.children}
              </div> : null }
          </div>
          { description ? <p className="description">{description}</p> : null }
        </div>
      </div>
    );
  }
}
