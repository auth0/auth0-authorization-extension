import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class InputCombo extends Component {

  onChange = (event) => {
    const { input: { onChange } } = this.props;
    onChange(event);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  renderOptions(options) {
    return options.map((option, index) => (
      <option key={index} value={option.value}>{option.text}</option>
    ));
  }

  render() {
    const { input, input: { name }, validationErrors, label, options, disabled } = this.props;

    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[name] && validationErrors[name].length
    });

    return (
      <div className={classes}>
        <label htmlFor={input.name} style={{ width: '100%' }}>
          <span style={{ display: 'inline-block', marginBottom: '5px' }}>{label}</span>
          <select className="form-control" {...input} id={input.name} onChange={this.onChange} disabled={disabled} >
            { options && options.length > 1 && <option value="">Select your application...</option>}
            { this.renderOptions(options) }
          </select>
        </label>
        { validationErrors && validationErrors[name] && validationErrors[name].length && <div className="help-block">{ validationErrors[name][0] }</div> }
      </div>
    );
  }
}

InputCombo.propTypes = {
  options: PropTypes.array.isRequired,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  validationErrors: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

export default InputCombo;
