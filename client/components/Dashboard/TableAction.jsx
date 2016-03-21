import React, { Component } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

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
        <Button onClick={this.onClick} bsStyle={ this.props.type || 'default' } bsSize="xsmall" disabled={this.props.disabled} style={{ padding: '6px 10px' }}>
          <i className={`icon icon-budicon-${this.props.icon}`} style={{ marginRight: '0px' }}></i>
        </Button>
      </OverlayTrigger>
    );
  }
}

TableAction.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool,
  icon: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  args: React.PropTypes.array
};

export default TableAction;
