import React, { Component, PropTypes } from 'react';

class GroupsIcon extends Component {
  render() {
    return (
      <svg className={this.props.className} width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Groups" transform="translate(1.000000, 1.000000)" stroke="currentColor" strokeWidth="2">
            <circle id="Oval" fill="#FFFFFF" cx="15" cy="4" r="4"></circle>
            <circle id="Oval" fill="#FFFFFF" cx="15" cy="26.5" r="3.5"></circle>
            <circle id="Oval" fill="#FFFFFF" cx="3.5" cy="26.5" r="3.5"></circle>
            <circle id="Oval" fill="#FFFFFF" cx="26.5" cy="26.5" r="3.5"></circle>
            <path d="M15,10 L15,20" id="Shape"></path>
            <polyline id="Shape" points="26 20 26 15 4 15 4 20"></polyline>
          </g>
        </g>
      </svg>
    );
  }
}

GroupsIcon.propTypes = {
  className: PropTypes.string
};

export default GroupsIcon;
