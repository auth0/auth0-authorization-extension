import React, { Component } from 'react';
import classNames from 'classnames';

class TableColumn extends Component {
  render() {
    const classes = classNames({
      'icon': this.props.isIcon
    });

    return (
      <th width={this.props.width} className={classes}>
        { this.props.children }
      </th>);
  }
}

TableColumn.propTypes = {
  width: React.PropTypes.string.isRequired
};

export default TableColumn;
