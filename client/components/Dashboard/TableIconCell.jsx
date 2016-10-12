import React, { PropTypes } from 'react';

import TableCell from './TableCell';

const TableIconCell = ({ color, icon }) => (

  <TableCell>
    <i style={{ color }} className={`icon-budicon-${icon}`} />
  </TableCell>

);

TableIconCell.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string.isRequired
};

export default TableIconCell;
