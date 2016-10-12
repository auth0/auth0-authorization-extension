import React, { Component, PropTypes } from 'react';

class TableCell extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  render() {
    return (
      <td className="truncate" style={this.props.style}>
        { this.props.children }
      </td>
    );
  }
}

TableCell.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
};

export default TableCell;
