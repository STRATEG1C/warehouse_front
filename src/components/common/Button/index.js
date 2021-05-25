import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, onClick, disabled, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button ${className}`}
    >
      {text}
    </button>
  )
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: ''
}

export default Button;
