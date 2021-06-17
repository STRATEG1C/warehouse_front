import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LOCATIONS, ORDERS, SUPPLIES } from '../../../constants/pathNames';
import './style.scss';

const SidebarWrapper = ({ title, subtitle, children }) => {
  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-wrapper__sidebar">
        <nav className="sidebar-wrapper__nav">
          <Link to={LOCATIONS} className="sidebar-wrapper__links text-size-medium">Локации</Link>
          <Link to={SUPPLIES} className="sidebar-wrapper__links text-size-medium">Поставки</Link>
          <Link to={ORDERS} className="sidebar-wrapper__links text-size-medium">Заказы</Link>
        </nav>
      </div>
      <div className="sidebar-wrapper__content">
        {title && (
          <div className="page-heading">
            <h1 className="page-heading__title">{title}</h1>
            <p className="page-heading_subtitle">{subtitle}</p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

SidebarWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SidebarWrapper;
