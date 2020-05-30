import * as React from 'react';
import { Drawer, List, ListItem, ListItemIcon, Typography, Divider, ListItemText } from '@material-ui/core';
import "../scss/todo-drawer.scss";
import { Link } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ArchiveIcon from '@material-ui/icons/Archive';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';

export interface ToDoDrawerProps {
  open: boolean;
  closeDrawer: () => void;
}

export const ToDoDrawer: React.FunctionComponent<ToDoDrawerProps> = ({ open, closeDrawer }): JSX.Element => (
  <Drawer open={open} onClose={closeDrawer} className="drawer" classes={{
    paper: "drawer-paper"
  }}>
    <List>
      <section className="nav-header">
        <Typography variant="h6">
          Navigate
        </Typography>
      </section>
      <ListItem button component={Link} to="/" onClick={closeDrawer}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/archive" onClick={closeDrawer}>
        <ListItemIcon>
          <ArchiveIcon />
        </ListItemIcon>
        <ListItemText primary="Archive" />
      </ListItem>
      <ListItem button component={Link} to="/search" onClick={closeDrawer}>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText primary="Search" />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  </Drawer>
)