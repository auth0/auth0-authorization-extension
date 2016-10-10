import React, { Component } from 'react';
import Select from 'react-select';
import '../../../node_modules/react-select/dist/react-select.css';
import './Multiselect.styl'

class Multiselect extends Component {
  constructor() {
    super();
    this.state = {
      value: []
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    this.setState({ value });
  }
  renderValue(value) {
    return (
      <span>
        <strong>{value.label}</strong>
        <span> ({value.email})</span>
      </span>
    );
  }
  render() {
    const { options, onChange } = this.props;
    return (
      <Select
        className="react-multiselect"
        name="react-multiselect"
        options={options}
        onChange={this.onChange}
        value={this.state.value}
        optionRenderer={this.renderValue}
        valueRenderer={this.renderValue}
        placeholder="Add members to the group"
        multi
      />
    );
  }
}

Multiselect.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func
};

export default Multiselect;
