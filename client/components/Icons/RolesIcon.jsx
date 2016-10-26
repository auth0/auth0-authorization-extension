import React, { Component, PropTypes } from 'react';

class RolesIcon extends Component {
  render() {
    return (
      <svg className={this.props.className} width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Page-1" stroke="none" strokeWidth="2" fill="none" fillRule="evenodd">
          <g id="Roles" transform="translate(1.000000, 1.000000)">
            <path d="M7,0 C3.1,0 0,3.1 0,7 C0,9.8 1.6,12.2 4,13.3 L4,27 L6,30 L7,30 L10,27 L10,25 L8,24 L8,22 L10,20 L8,18 L10,16" id="Shape" stroke="currentColor" strokeWidth="2"></path>
            <path d="M10,13.3 C12.4,12.2 14,9.8 14,7" id="Shape" stroke="currentColor" strokeWidth="2"></path>
            <path d="M18.7,2.1 C16,-0.6 11.5,-0.6 8.8,2.1 C6.1,4.8 6.1,9.3 8.8,12 C10.8,14 13.6,14.5 16.1,13.6 L25.8,23.3 L29.3,24 L30,23.3 L30,19.1 L28.6,17.7 L26.5,18.4 L25.1,17 L25.1,14.2 L22.3,14.2 L22.3,11.4 L20.4,9.5 C21.2,6.9 20.7,4.1 18.7,2.1 L18.7,2.1 Z" id="Shape" stroke="currentColor" strokeWidth="2" fill="#FFFFFF"></path>
            <circle id="Oval" fill="currentColor" transform="translate(12.997600, 5.999000) rotate(-45.000000) translate(-12.997600, -5.999000) " cx="12.9976192" cy="5.99901918" r="2"></circle>
          </g>
        </g>
      </svg>
    );
  }
}

RolesIcon.propTypes = {
  className: PropTypes.string
};

export default RolesIcon;
