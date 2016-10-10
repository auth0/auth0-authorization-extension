import React, { Component } from 'react';
import classNames from 'classnames';

class InputCombo extends Component {
  onChange = (event) => {
    const { field } = this.props;
    field.onChange(event);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    const { label, field, fieldName, options, validationErrors} = this.props;
    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length
    });

    return (
      <div className={classes}>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'inline-block', marginBottom: '5px' }}>{label}</span>
          <select className="form-control" {...this.props} {...field} onChange={this.onChange}>
            { options.length > 1 && <option value="">Select your application...</option>}
            {options.map((option, index) => {
              return <option key={index} value={option.value}>{option.text}</option>;
            })}
          </select>
        </label>
        { validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length && <div className="help-block">{ validationErrors[fieldName][0] }</div> }
      </div>
    );
  }
}

InputCombo.propTypes = {
  options: React.PropTypes.array.isRequired,
  field: React.PropTypes.object.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  validationErrors: React.PropTypes.object
};

export default InputCombo;
