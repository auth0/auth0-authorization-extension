import React, { PropTypes } from 'react';
import TableCell from './TableCell';

const TableTextCell = ({ children, onClick }) => {
  if (onClick) {
    return (
      <TableCell>
        <a href="#" onClick={() => onClick()} title={children || ''}>{ children || '' }</a>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <span title={children || ''}>{ children || '' }</span>
    </TableCell>
  );
};

TableTextCell.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node
};

export default TableTextCell;
