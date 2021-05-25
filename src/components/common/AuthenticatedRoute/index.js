import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { selectCurrentUser } from '../../../store/Auth';

const AuthenticatedRoute = ({ ...props }) => {
  const currentUser = useSelector(state => selectCurrentUser(state.auth));

  if (currentUser) {
    return (
      <Route { ...props } />
    );
  } else {
    return <Redirect to="/login" />
  }
};

export default AuthenticatedRoute;
