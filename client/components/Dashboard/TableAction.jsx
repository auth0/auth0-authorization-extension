import React, { Component, PropTypes } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './TableAction.styl';

class TableAction extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.props.args) {
      this.props.onClick(...this.props.args);
    } else {
      this.props.onClick();
    }
  }

  render() {
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip id={this.props.id}>{this.props.title}</Tooltip>}>
        <Button
          className="table-action"
          onClick={this.onClick}
          bsStyle={this.props.type || 'default'}
          bsSize="xsmall"
          disabled={this.props.disabled}
        >
          <i className={`icon icon-budicon-${this.props.icon}`} style={{ marginRight: '0px' }} />
        </Button>
      </OverlayTrigger>
    );
  }
}

TableAction.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  args: PropTypes.array
};

export default TableAction;
