import React, { Component, PropTypes } from 'react';

export default class SectionHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }

  render() {
    const { title, description } = this.props;
    return (
      <div className="extension-section-header row">
        <div className="col-xs-12">
          <div className="title-container">
            <h2 className="title">{title}</h2>
            <div className="buttons-container">
              {this.props.children}
            </div>
          </div>
          <p className="description">{description}</p>
        </div>
      </div>
    );
  }
}
