import React, { Component, PropTypes } from 'react';

class UsersIcon extends Component {
  render() {
    return (
      <svg className="item-image" width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="user" transform="translate(1.000000, 1.000000)" stroke="currentColor" strokeWidth="2">
            <circle id="Oval" cx="15" cy="15" r="15"></circle>
            <path d="M25.7,25.5 C23,22.7 19.2,21 15,21 C10.8,21 7,22.7 4.3,25.5" id="Shape"></path>
            <circle id="Oval" cx="15" cy="12" r="5"></circle>
          </g>
        </g>
      </svg>
    );
  }
}

UsersIcon.propTypes = {
  className: PropTypes.string
};

export default UsersIcon;
