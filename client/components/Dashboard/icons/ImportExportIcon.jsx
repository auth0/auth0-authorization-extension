import React, { Component, PropTypes } from 'react';

class ImportExportIcon extends Component {
  render() {
    return (
      <svg className={this.props.className} width="26px" height="31px" viewBox="0 0 26 31" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Permisions" transform="translate(1.000000, 1.000000)" stroke="currentColor" strokeWidth="2">
            <circle id="Oval" cx="12" cy="7" r="7" />
            <path d="M18,26 L0,26 C0,19.4 5.4,14 12,14" id="Shape" />
            <circle id="Oval" cx="21" cy="18" r="3" />
            <polyline id="Shape" points="21 21 21 29 24 29" />
            <path d="M21,26 L23,26" id="Shape" />
          </g>
        </g>
      </svg>
    );
  }
}

ImportExportIcon.propTypes = {
  className: PropTypes.string
};

export default ImportExportIcon;
