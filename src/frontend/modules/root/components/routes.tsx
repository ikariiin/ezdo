import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Dashboard } from '../../dashboard/components/dashboard';
import { Login } from '../../auth/components/login';
import { Register } from '../../auth/components/register';
import { Archive } from '../../archive/modules/archive';
import { Search } from '../../search/components/search';
import { About } from '../../about/components/about';
import { Group } from '../../groups/components/group';

export interface RoutesProps {
  changeTitle: (title: string) => any;
  refreshDrawerGroups: () => any;
}

export const Routes: React.FunctionComponent<RoutesProps> = (props): JSX.Element => {
  return (
    <>
      <Route exact path="/login">
        <Login {...props} />
      </Route>
      <Route exact path="/register">
        <Register {...props} />
      </Route>
      <Route exact path="/">
        <Dashboard {...props} />
      </Route>
      <Route exact path="/search">
        <Search {...props} />
      </Route>
      <Route exact path="/archive">
        <Archive {...props} />
      </Route>
      <Route exact path="/about">
        <About {...props} />
      </Route>
      <Route path="/groups/:groupId/:groupName">
        <Group {...props} />
      </Route>
    </>
  )
}