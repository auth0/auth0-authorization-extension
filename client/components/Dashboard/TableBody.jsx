import React, { PropTypes } from 'react';

const TableBody = ({ children }) => (
  <tbody>
  { children }
  </tbody>
);

TableBody.propTypes = {
  children: PropTypes.node
};
export default TableBody;
