import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SUPPLIES_IN_WAREHOUSE, TASK_LIST } from '../../../constants/pathNames';
import './style.scss';

const MobileViewWrapper = ({ title, children }) => {
  return (
    <div className="mobile-wrapper">
      {title && (
        <div>
          <div className="mobile-wrapper__nav">
            <Link to={SUPPLIES_IN_WAREHOUSE} className="sidebar-wrapper__links text-size-medium">Поставки</Link>
            <Link to={TASK_LIST} className="sidebar-wrapper__links text-size-medium">Задания</Link>
          </div>
          <h1 className="page-heading__title">{title}</h1>
        </div>
      )}
      {children}
    </div>
  );
};

MobileViewWrapper.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default MobileViewWrapper;
