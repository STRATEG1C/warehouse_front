import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const Spinner = ({ className }) => {
  return (
    <div className={`lds-facebook ${className}`}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

Spinner.propTypes = {
  className: PropTypes.string,
};

Spinner.defaultProps = {
  className: '',
};

export default Spinner;
