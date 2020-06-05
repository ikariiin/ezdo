import * as React from 'react';
import { Drawer, List, ListItem, ListItemIcon, Typography, Divider, ListItemText, Avatar, ListItemAvatar, Hidden, Theme, createStyles, withStyles, WithStyles } from '@material-ui/core';
import "../scss/todo-drawer.scss";
import { Link } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ArchiveIcon from '@material-ui/icons/Archive';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import AboutIcon from '@material-ui/icons/Info';
import { API_GROUPS, API_HOST, API_USERNAME } from '../../util/api-routes';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { Groups } from '../../../../backend/entities/groups';
import GroupIcon from '@material-ui/icons/ViewModule';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import ComputerIcon from '@material-ui/icons/Computer';

const styles = (theme: Theme) => createStyles({
  toolbar: theme.mixins.toolbar
});

export interface ToDoDrawerProps extends WithSnackbarProps, WithStyles<typeof styles> {
  open: boolean;
  closeDrawer: () => void;
  setRefreshDrawerGroups: (refresh: () => any) => any;
  changeTheme: (theme: "dark"|"light") => any;
}

@observer
class ToDoDrawerComponent extends React.Component<ToDoDrawerProps> {
  @observable groups: Array<Groups> = [];
  @observable username: string = "User";

  private async getGroupEntries(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_GROUPS}`, {
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ''
      }
    });
  
    const responseJSON = await response.json();
    if(responseJSON.failed) {
      // this.props.enqueueSnackbar("Failed to fetch groups, for the drawer. " + responseJSON.reason, {
      //   variant: "error"
      // });
      console.error(responseJSON);
      return;
    }
  
    this.groups = responseJSON;
  }

  private async getUsername(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_USERNAME}`, {
      headers:{
        Authorization: localStorage.getItem('jwtKey') || ''
      }
    });
    const responseJSON = await response.json();
    if(responseJSON.failed) {
      // this.props.enqueueSnackbar("Failed to fetch username. " + responseJSON.reason, {
      //   variant: "error"
      // });
      console.error(responseJSON);
      return;
    }
    this.username = responseJSON.username;
  }

  public componentDidMount() {
    this.getGroupEntries();
    this.getUsername();
    this.props.setRefreshDrawerGroups(() => {
      this.getGroupEntries();
    });
  }

  private get drawerContent(): React.ReactNode {
    if(!localStorage.getItem("jwtKey")) {
      return (
        <List>
          <section className="nav-header">
            <Typography variant="h5">
              EZDo
            </Typography>
          </section>
          <Divider />
          <section className="nav-header">
            <Typography variant="body2" color="textSecondary">Login to view content</Typography>
          </section>
        </List>
      )
    }
    return (
      <List>
        <section className="nav-header">
          <Typography variant="h5">
            EZDo
          </Typography>
        </section>
        <Divider />
        <section className="nav-header sub">
          Navigate
        </section>
        <ListItem button component={Link} to="/" onClick={this.props.closeDrawer}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/archive" onClick={this.props.closeDrawer}>
          <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>
          <ListItemText primary="Archive" />
        </ListItem>
        <ListItem button component={Link} to="/search" onClick={this.props.closeDrawer}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItem>
        <ListItem button component={Link} to="/about" onClick={this.props.closeDrawer}>
          <ListItemIcon>
            <AboutIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
        <Divider />
        <section className="nav-header sub">
          Groups
        </section>
        {this.groups.length === 0 && (
          <ListItem>
            <ListItemText primary="No groups created yet" />
          </ListItem>
        )}
        {this.groups.map(group => (
          <ListItem button component={Link} to={`/groups/${group.id}/${group.name}`} onClick={this.props.closeDrawer}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
        <Divider />
        <section className="nav-header sub">
          Profile
        </section>
        <ListItem>
          <ListItemAvatar>
            <Avatar color="primary">{this.username[0].toLocaleUpperCase()}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={this.username} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            this.props.changeTheme(window.localStorage.getItem("ezdo-app-theme") === "dark" ? "light" : "dark");
            this.props.closeDrawer();
          }}>
          <ListItemIcon>
            <ComputerIcon />
          </ListItemIcon>
          <ListItemText primary="Toggle Theme" />
        </ListItem>
        <ListItem button onClick={() => { localStorage.removeItem("jwtKey"); window.location.pathname = "/login"; }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    );
  }

  public render() {
    const { classes } = this.props;
    if(!localStorage.getItem("jwtKey")) return null;
    
    return (
      <>
        <Hidden smUp implementation="js">
          <Drawer
            open={this.props.open}
            onClose={this.props.closeDrawer}
            variant="temporary"
            className="drawer"
            classes={{
              paper: "drawer-paper"
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {this.drawerContent}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="js">
          <Drawer
            open
            className="drawer"
            classes={{
              paper: "drawer-paper"
            }}
            variant="permanent"
          >
            <div className={classes.toolbar} />
            {this.drawerContent}
          </Drawer>
        </Hidden>
      </>
    );
  }
} 

export const ToDoDrawer = withStyles(styles)(withSnackbar(ToDoDrawerComponent));