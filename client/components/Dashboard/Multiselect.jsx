import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import '../../../node_modules/react-select/dist/react-select.css';
import './Multiselect.styl';

class Multiselect extends Component {

  renderValue(value) {
    return (
      <span>
        <strong>{value.label}</strong>
        <span> ({value.email})</span>
      </span>
    );
  }
  render() {
    const { input, options } = this.props;

    // NOTE: see https://github.com/erikras/redux-form/issues/82 for onBlur() react-select docs
    return (
      <Select
        {...input}
        className="react-multiselect"
        name="react-multiselect"
        options={options}
        optionRenderer={this.renderValue}
        valueRenderer={this.renderValue}
        onBlur={() => input.onBlur()}
        placeholder="Add members to the group"
        multi
      />
    );
  }
}

Multiselect.propTypes = {
  options: PropTypes.array.isRequired,
  onBlur: PropTypes.func,
  input: PropTypes.object
};

export default Multiselect;
