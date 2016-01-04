import React, { Component } from 'react';
import TableCell from './TableCell';

class TableTextCell extends Component {
  render() {
    if (this.props.onClick) {
      return <TableCell>
        <a href="#" onClick={() => this.props.onClick()} title={ this.props.children || '' }>{ this.props.children || '' }</a>
      </TableCell>;
    }

    return <TableCell>
      <span title={ this.props.children || '' }>{ this.props.children || '' }</span>
    </TableCell>;
  }
}

TableTextCell.propTypes = {
  onClick: React.PropTypes.func
};

export default TableTextCell;
