import * as React from 'react';
import { Drawer, List, ListItem, ListItemIcon, Typography } from '@material-ui/core';
import "../scss/todo-drawer.scss";
import { Link } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';

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
        Dashboard
      </ListItem>
    </List>
  </Drawer>
)