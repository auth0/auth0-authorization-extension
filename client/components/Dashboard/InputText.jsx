import React, { Component } from 'react';
import classNames from 'classnames';

class InputText extends Component {
  render() {
    const { label, field, fieldName, validationErrors, placeholder } = this.props;
    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length
    });

    return (
      <div className={classes}>
        <label style={{ width: '100%' }}>
          <span style={{ display: 'inline-block', marginBottom: '5px' }}>{label}</span>
          <input className="form-control" type="text" placeholder={placeholder} {...field} />
        </label>
        { validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length && <div className="help-block">{ validationErrors[fieldName][0] }</div> }
      </div>
    );
  }
}

InputText.propTypes = {
  field: React.PropTypes.object.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  validationErrors: React.PropTypes.object
};

export default InputText;
