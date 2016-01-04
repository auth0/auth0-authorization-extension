import React, { Component } from 'react';

import TableCell from './TableCell';

class TableIconCell extends Component {
  render() {
    return (
      <TableCell>
        <i style={{ color: this.props.color }} className={`icon-budicon-${this.props.icon}`}></i>
      </TableCell>);
  }
}

TableIconCell.propTypes = {
  color: React.PropTypes.string,
  icon: React.PropTypes.string.isRequired
};

export default TableIconCell;
