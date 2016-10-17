import React, { PropTypes } from 'react';

const Table = ({ children }) => (
  <table className="table data-table" style={{ tableLayout: 'fixed' }}>
    { children }
  </table>
);

Table.propTypes = {
  children: PropTypes.node
};

export default Table;
