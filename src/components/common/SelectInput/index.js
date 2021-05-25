import React from 'react';
import PropTypes from 'prop-types';

const SelectInput = ({ label, name, value, options, disabled, placeholder, onChange, error, className }) => {
  const onChangeHandler = (e) => onChange && onChange(name, e.target.value);

  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={name}>{label}</label> }
      <select
        name={name}
        value={value}
        onChange={onChangeHandler}
        placeholder={placeholder}
        className="input-group__input"
        data-testid="text-input"
        disabled={disabled}
      >
        {options.map(option => <option value={option.value} key={option.title}>{option.title}</option>)}
      </select>
      {error && <span className="error">{error}</span>}
    </div>
  )
}

SelectInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
}

SelectInput.defaultProps = {
  type: 'text',
  error: '',
  label: '',
  disabled: false,
  placeholder: '',
  className: ''
}

export default SelectInput;
