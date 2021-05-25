import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const OptionChain = ({ label, options, onChange, value }) => {
  const onClickHandler = (value) => {
    onChange && onChange(value);
  }

  return (
    <div className="option-chain__wrapper">
      <p>{ label }</p>
      <div className="option-chain">
        {options.map(item => (
          <div
            onClick={() => onClickHandler(item.value)}
            className={`option-chain__option ${item.value === value ? 'selected' : ''}`}
            key={item.value}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

OptionChain.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired
};

OptionChain.defaultProps = {
  label: ''
};

export default OptionChain;
