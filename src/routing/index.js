import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CREATE_LOCATIONS,
  EDIT_LOCATION,
  LOCATIONS,
  LOGIN,
  SUPPLIES,
  SUPPLIES_IN_WAREHOUSE,
  SUPPLY_INFO, SUPPLY_UNLOADING, TASK, TASK_LIST,
} from '../constants/pathNames';
import { selectCurrentUser } from '../store/Auth';
import Login from '../components/screens/Login';
import { userRoles } from '../constants/common';
import AuthenticatedRoute from '../components/common/AuthenticatedRoute';
import Home from '../components/screens/manager/Locations';
import CreateLocation from '../components/screens/manager/CreateLocation';
import EditLocation from '../components/screens/manager/EditLocation';
import Supplies from '../components/screens/manager/Supplies';
import SupplyInfo from '../components/screens/manager/SupplyInfo';
import SupplyList from '../components/screens/worker/SupplyList';
import SupplyUnloading from '../components/screens/worker/SupplyUnloading';
import TaskList from '../components/screens/worker/TaskList';
import TaskPage from '../components/screens/worker/TaskPage';

const Routing = () => {
  const currentUser = useSelector(state => selectCurrentUser(state.auth));

  const getRoutes = () => {
    if (!currentUser) {
      return null;
    }

    return currentUser.role_id === userRoles.manager
      ? (
        <>
          <AuthenticatedRoute exact path={LOCATIONS} component={Home} />
          <AuthenticatedRoute exact path={CREATE_LOCATIONS} component={CreateLocation} />
          <AuthenticatedRoute exact path={EDIT_LOCATION} component={EditLocation} />
          <AuthenticatedRoute exact path={SUPPLIES} component={Supplies} />
          <AuthenticatedRoute exact path={SUPPLY_INFO} component={SupplyInfo} />
        </>
      )
      : (
        <>
          <AuthenticatedRoute exact path={SUPPLIES_IN_WAREHOUSE} component={SupplyList} />
          <AuthenticatedRoute exact path={SUPPLY_UNLOADING} component={SupplyUnloading} />
          <AuthenticatedRoute exact path={TASK_LIST} component={TaskList} />
          <AuthenticatedRoute exact path={TASK} component={TaskPage} />
        </>
      );
  }

  const routes = getRoutes();

  return (
    <Router>
      <Switch>
        <Route exact path={LOGIN} component={Login} />
        {routes}
        <Redirect to={LOGIN} />
      </Switch>
    </Router>
  );
};

export default Routing;
