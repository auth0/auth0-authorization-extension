import React, { Component } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

class TableAction extends Component {
  render() {
    return <OverlayTrigger placement="top" overlay={<Tooltip id={this.props.id}>{this.props.title}</Tooltip>}>
      <Button onClick={this.props.onClick} bsStyle={ this.props.type || 'default' } bsSize="xsmall" disabled={this.props.disabled} style={{ padding: '6px 10px' }}>
        <i className={`icon icon-budicon-${this.props.icon}`} style={{ marginRight: '0px' }}></i>
      </Button>
    </OverlayTrigger>;
  }
}

TableAction.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool,
  icon: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func
};

export default TableAction;
