import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LOGIN } from '../../../constants/pathNames';
import './style.scss';

const PageWrapper = ({ title, match, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const routesWithoutHeader = [
    LOGIN
  ];

  const isHeaderShown = !routesWithoutHeader.find(item => item === match.path);

  return (
    <div className="page-wrapper">
      <div className="header">
        {isHeaderShown && (
          <div className="header__logo">
            WMS
          </div>
        )}
      </div>
      <div className="page-wrapper__content">
        {children}
      </div>
    </div>
  )
}

PageWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default PageWrapper;
