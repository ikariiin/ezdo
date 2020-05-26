import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Dashboard } from '../../dashboard/components/dashboard';
import { Login } from '../../auth/components/login';
import { Register } from '../../auth/components/register';

export const Routes: React.FunctionComponent<{}> = ({}): JSX.Element => {
  const jwtToken = localStorage.getItem('jwtKey');

  return (
    <>
      <Route exact path="/">
        <Dashboard />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      {!jwtToken && <Redirect to="/login" />}
    </>
  )
}