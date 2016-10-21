import React, { PropTypes } from 'react';

const TableRow = ({ children }) => (
  <tr>
  { children }
  </tr>
);

TableRow.propTypes = {
  children: PropTypes.node
};

export default TableRow;
