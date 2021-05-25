import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const MobileViewWrapper = ({ title, children }) => {
  return (
      <div className="mobile-wrapper">
      {title && <h1 className="page-heading__title">{title}</h1>}
      {children}
    </div>
  );
};

MobileViewWrapper.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default MobileViewWrapper;
