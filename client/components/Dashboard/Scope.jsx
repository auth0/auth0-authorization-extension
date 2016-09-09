import React, { Component, PropTypes } from 'react';

export default class Scope extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  onChange = (event) => {
    const { value, field } = this.props;
    field.value = field.value || [ ];

    const index = field.value.indexOf(value);
    if (index < 0) {
      if (event.target.checked) {
        field.onChange(field.value.concat(value));
      }
    } else {
      if (!event.target.checked) {
        const copy = [ ...field.value ];
        copy.splice(index, 1);
        field.onChange(copy);
      }
    }
  }

  isChecked = (field, value) => field.value && field.value.indexOf(value) >= 0;

  render() {
    const { value, text, field } = this.props;
    return (
      <div className="scope-toggle" style={{ marginBottom: '10px' }}>
        <input type="checkbox" checked={this.isChecked(field, value)} onChange={this.onChange} defaultValue={value} className="scope-input" />
        <label className="status">{text}</label>
      </div>
    );
  }
}
