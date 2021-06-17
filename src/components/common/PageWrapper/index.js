import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LOGIN } from '../../../constants/pathNames';
import './style.scss';
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { signOut } from '../../../store/Auth/thunks';
import { useHistory } from 'react-router-dom';

const PageWrapper = ({ title, match, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const routesWithoutHeader = [
    LOGIN
  ];

  const isHeaderShown = !routesWithoutHeader.find(item => item === match.path);

  const dispatch = useDispatch();
  const history = useHistory();

  const onLogout = () => {
    dispatch(signOut());
    history.push(LOGIN);
  }

  return (
    <div className="page-wrapper">
      {isHeaderShown && (
        <div className="header">
          <div className="header__logo">WMS</div>
          <Button text="Выйти" onClick={onLogout} className="btn" />
        </div>
      )}
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
