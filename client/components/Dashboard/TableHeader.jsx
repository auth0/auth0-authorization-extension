import React, { PropTypes } from 'react';

const TableHeader = ({ children }) => (
  <thead>
    <tr>
    { children }
    </tr>
  </thead>
);

TableHeader.propTypes = {
  children: PropTypes.node
};

export default TableHeader;
