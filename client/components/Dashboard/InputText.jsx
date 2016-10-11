import React from 'react';
import classNames from 'classnames';

const InputText = field => {
  const validationErrors = field.validationErrors;
  const classes = classNames({
    'form-group': true,
    'has-error': validationErrors && validationErrors[field.name] && validationErrors[field.name].length
  });


  return (
    <div className={classes}>
      <label style={{ width: '100%' }}>
        <span style={{ display: 'inline-block', marginBottom: '5px' }}>{field.label}</span>
        <input className="form-control" {...field.input} id={field.name} type="text" placeholder={field.placeholder} />
      </label>
      { field.validationErrors && validationErrors[field.name] && validationErrors[field.name].length && <div className="help-block">{ validationErrors[field.name][0] }</div> }
    </div>
  );
};

export default InputText;
