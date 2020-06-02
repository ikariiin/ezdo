import * as React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { getTheme } from './mui-theme';
import "../scss/app-base.scss";
import { NavBar } from '../../common/components/navbar';
import {  BrowserRouter as Router ,Switch } from 'react-router-dom';
import { Routes } from './routes';
import { MuiPickersUtilsProvider  } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import {SnackbarProvider} from 'notistack';
import { isMobile } from '../../util/is-mobile';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

@observer
export class AppBase extends React.Component<{}> {
  @observable navbarTitle: string = "EZDo";
  refreshDrawerGroups: () => any = () => {};

  @action private changeNavbarTitle(title: string): void {
    this.navbarTitle = title;
  }

  public render() {
    return (
      <MuiThemeProvider theme={getTheme("dark")}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider maxSnack={2} dense={isMobile()}>
            <Router>
              <main className="container">
                <NavBar title={this.navbarTitle} setRefreshDrawerGroups={refresh => this.refreshDrawerGroups = refresh} />
                <Switch>
                  <Routes refreshDrawerGroups={() => this.refreshDrawerGroups()} changeTitle={(title: string) => this.changeNavbarTitle(title)} />
                </Switch>
              </main>
            </Router>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}