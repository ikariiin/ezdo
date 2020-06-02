import * as React from 'react';
import "../scss/navbar.scss";
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ToDoDrawer } from './todo-drawer';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';

export interface NavBarProps {
  title: string;
  setRefreshDrawerGroups: (refresh: () => any) => any;
}

@observer 
export class NavBar extends React.Component<NavBarProps> {
  @observable drawerOpen: boolean = false;

  private closeDrawer(): void {
    this.drawerOpen = false;
  }

  public render() {
    const isLoggedIn = localStorage.getItem('jwtKey');

    return (
      <>
        <ToDoDrawer open={this.drawerOpen} closeDrawer={() => this.closeDrawer()} setRefreshDrawerGroups={this.props.setRefreshDrawerGroups} />
        <AppBar color="default" className="navbar" position="relative">
          <Toolbar>
            {isLoggedIn && (
              <IconButton onClick={() => this.drawerOpen = !this.drawerOpen}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" className="app-name">
              {this.props.title}
            </Typography>
            {isLoggedIn && (
              <IconButton component={Link} to="/search">
                <SearchIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </>
    )
  }
}