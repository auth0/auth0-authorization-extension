import React, { Component, PropTypes } from 'react';
import Scope from './Scope';

export default class ScopeGroup extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    options: PropTypes.string.isRequired
  }

  render() {
    const { options, field } = this.props;
    return (
      <div>
        {options.map(option => <Scope field={field} text={option.text} value={option.value} />)}
      </div>
    );
  }
}
