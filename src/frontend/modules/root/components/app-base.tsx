import * as React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { getTheme } from './mui-theme';
import "../scss/app-base.scss";
import { NavBar } from '../../common/components/navbar';
import {  BrowserRouter as Router ,Switch } from 'react-router-dom';
import { Routes } from './routes';
import { MuiPickersUtilsProvider  } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

export class AppBase extends React.Component<{}> {
  public render() {
    return (
      <MuiThemeProvider theme={getTheme("dark")}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router>
            <main className="container">
              <NavBar />
              <Switch>
                <Routes />
              </Switch>
            </main>
          </Router>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}