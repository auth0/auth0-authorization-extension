import React, { Component, PropTypes } from 'react';
import Scope from './Scope';

export default class ScopeGroup extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    label: PropTypes.string
  }

  render() {
    const { options, field, label } = this.props;
    return (
      <div className="form-group">
        { label && <label>{label}</label> }
        <br />
        <div
          className="form-control"
          style={{
            maxHeight: '151px',
            overflowY: 'scroll',
            height: 'auto',
            padding: '12px 12px 2px 12px',
            boxShadow: 'none'
          }}
        >
          {options.map(option => <Scope field={field} text={option.text} value={option.value} />)}
        </div>
      </div>
    );
  }
}
