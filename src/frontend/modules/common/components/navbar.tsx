import * as React from 'react';
import "../scss/navbar.scss";
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ToDoDrawer } from './todo-drawer';

@observer 
export class NavBar extends React.Component<{}> {
  @observable drawerOpen: boolean = false;

  private closeDrawer(): void {
    this.drawerOpen = false;
  }

  public render() {
    const isLoggedIn = localStorage.getItem('jwtKey');

    return (
      <>
        <ToDoDrawer open={this.drawerOpen} closeDrawer={() => this.closeDrawer()} />
        <AppBar color="default" className="navbar" position="relative">
          <Toolbar>
            {isLoggedIn && (
              <IconButton onClick={() => this.drawerOpen = !this.drawerOpen}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" className="app-name">
              Tos Dos
            </Typography>
          </Toolbar>
        </AppBar>
      </>
    )
  }
}