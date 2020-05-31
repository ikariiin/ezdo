import * as React from 'react';
import { Dialog, DialogProps, List, ListItem, ListItemText, DialogTitle, ListItemAvatar, Avatar, Typography } from '@material-ui/core';
import { API_HOST, API_GROUPS, API_TODO_MOVE } from '../../../util/api-routes';
import { Groups } from '../../../../../backend/entities/groups';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import CloseIcon from '@material-ui/icons/Close';
import { WithSnackbarProps, withSnackbar } from 'notistack';

export interface TaskMoveProps extends DialogProps, WithSnackbarProps {
  currentGroupId: number;
  close: () => any;
  todoId: number;
  refreshGroup: (id: number) => any;
}

@observer
class TaskMoveComponent extends React.Component<TaskMoveProps> {
  @observable private groups: Array<Groups> = [];
  private async fetchGroups(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_GROUPS}`, {
      headers: {
        Authorization: localStorage.getItem('jwtKey') || ''
      },
      method: "GET"
    });
    const responseJSON = await response.json();

    if(responseJSON.failed) {
      // We messed up.
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      console.error(responseJSON);
      return;
    }

    this.groups = responseJSON;
  }

  public componentDidMount() {
    this.fetchGroups();
  }

  private async moveToGroup(groupId: number): Promise<void> {
    const response = await fetch(`${API_HOST}${API_TODO_MOVE}/${this.props.todoId}`, {
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem('jwtKey') || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ groupId })
    });

    const responseJSON = await response.json();

    if(responseJSON.failed) {
      console.error(responseJSON);
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }

    this.props.close();
    console.log(responseJSON);
    this.props.refreshGroup(groupId);
    this.props.refreshGroup(this.props.currentGroupId);
  }

  public render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle>Move to another group</DialogTitle>
        <List>
          {this.groups.filter(group => group.id !== this.props.currentGroupId).map(group => (
            <ListItem button key={group.id} onClick={() => this.moveToGroup(group.id)}>
              <ListItemAvatar>
                <Avatar style={{ background: '#01A8D5' }}>
                  <Typography variant="h6">
                    {group.name[0].toUpperCase()}
                  </Typography>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={group.name} />
            </ListItem>
          ))}
          <ListItem button onClick={this.props.close}>
            <ListItemAvatar>
              <Avatar>
                <CloseIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Cancel" />
          </ListItem>
        </List>
      </Dialog>
    )
  }
}

export const TaskMove = withSnackbar(TaskMoveComponent);