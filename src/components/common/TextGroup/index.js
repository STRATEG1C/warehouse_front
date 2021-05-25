import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const TextGroup = ({ label, value, className }) => {
  return (
    <div className={`input-group ${className}`}>
      <span>{label}</span><span className="text-group__value">{value}</span>
    </div>
  )
}

TextGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string
}

TextGroup.defaultProps = {
  className: ''
}

export default TextGroup;
