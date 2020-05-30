import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Dashboard } from '../../dashboard/components/dashboard';
import { Login } from '../../auth/components/login';
import { Register } from '../../auth/components/register';
import { Archive } from '../../archive/modules/archive';
import { Search } from '../../search/components/search';

export const Routes: React.FunctionComponent<{}> = ({}): JSX.Element => {
  const jwtToken = localStorage.getItem('jwtKey');

  return (
    <>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/">
        <Dashboard />
      </Route>
      <Route exact path="/search">
        <Search />
      </Route>
      <Route exact path="/archive">
        <Archive />
      </Route>
      {!jwtToken && <Redirect to="/login" />}
    </>
  )
}