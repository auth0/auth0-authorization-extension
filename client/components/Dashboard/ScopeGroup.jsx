import React, { Component, PropTypes } from 'react';
import Scope from './Scope';

export default class ScopeGroup extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    options: PropTypes.string.isRequired,
    label: PropTypes.string
  }

  render() {
    const { options, field, label } = this.props;
    return (
      <div class="form-group">
        { label && <label>{label}</label> }
        <br/>
        {options.map(option => <Scope field={field} text={option.text} value={option.value} />)}
      </div>
    );
  }
}
