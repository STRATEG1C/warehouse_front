import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({ label, name, value, placeholder, disabled, onChange, type, error, className }) => {
  const onChangeHandler = (e) => onChange && onChange(name, e.target.value);

  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={name}>{label}</label> }
      <input
        name={name}
        value={value}
        onChange={onChangeHandler}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="input-group__input"
        data-testid="text-input"
      />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string
}

TextInput.defaultProps = {
  type: 'text',
  error: '',
  label: '',
  disabled: false,
  placeholder: '',
  className: ''
}

export default TextInput;
