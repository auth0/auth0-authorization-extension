import React, { Component } from 'react';
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
    return options.map((option, index) => {
      return <option key={index} value={option.value}>{option.text}</option>;
    });
  }

  render() {
    const { input, input: { name }, validationErrors, label, options, disabled } = this.props;

    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[name] && validationErrors[name].length
    });

    return (
      <div className={classes}>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'inline-block', marginBottom: '5px' }}>{label}</span>
          <select className="form-control" {...input} onChange={this.onChange} disabled={disabled} >
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
  options: React.PropTypes.array.isRequired,
  input: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
  validationErrors: React.PropTypes.object,
  onChange: React.PropTypes.func,
  disabled: React.PropTypes.bool
};

export default InputCombo;
