import * as React from 'react';
import { Typography, Paper, IconButton, Tooltip } from '@material-ui/core';
import "../scss/group.scss";
import AddIcon from '@material-ui/icons/AddTwoTone';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { NewTask } from './new-task';
import { Todo } from '../../../../backend/entities/todo';
import { API_HOST, API_TODOS, API_GROUPS } from '../../util/api-routes';
import { Task } from './task';
import { GroupDeleteConfirm } from './dialogs/group-delete-confirm';
import { WithSnackbarProps, withSnackbar } from 'notistack';

export interface GroupProps extends WithSnackbarProps {
  title: string;
  id: number;
  refreshGroup: (groupId: number) => any;
  groupUpdate: number;
  refresh: () => any;
}

@observer
class GroupComponent extends React.Component<GroupProps> {
  @observable private createMode: boolean = false;
  @observable private tasks: Array<Todo> = [];
  @observable private confirmDelete: boolean = false;

  private async getTasks(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_TODOS}/${this.props.id}/all`, {
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ""
      }
    });
    
    const responseJSON = await response.json();

    if(responseJSON.failed) {
      console.error(responseJSON);
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }

    this.tasks = responseJSON;
  }

  public componentDidMount() {
    this.getTasks();
  }

  public componentDidUpdate(prevProps: GroupProps) {
    if(prevProps.groupUpdate !== this.props.groupUpdate) {
      this.getTasks();
    }
  }

  @computed private get noContent(): React.ReactNode {
    if(!this.createMode && this.tasks.length === 0) {
      return (
        <section className="no-content">
          <div className="illustration" />
          <Typography variant="body1" className="text">
            Looks like there's no tasks in this group yet. Create one by clicking the Add icon above!
          </Typography>
        </section>
      );
    }

    return null;
  }

  @computed private get tasksRender(): React.ReactNode {
    if(this.tasks.length === 0) return null;

    return (
      <section className="tasks">
        {this.tasks.map(task => (
          <Task {...task} refresh={() => this.getTasks()} refreshGroup={this.props.refreshGroup} key={task.id} />
        ))}
      </section>
    );
  }

  private async deleteGroup(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_GROUPS}/${this.props.id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ''
      }
    });

    const responseJSON = await response.json();

    if(responseJSON.failed) {
      console.error(responseJSON);
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }

    this.props.refresh();
  }
  
  public render() {
    return (
      <Paper className="group" elevation={2}>
        <GroupDeleteConfirm
          close={() => this.confirmDelete = false}
          onClose={() => this.confirmDelete = false}
          onDelete={() => this.deleteGroup()}
          open={this.confirmDelete} />
        <header className="group-header">
          <Typography variant="h5" className="title">{this.props.title}</Typography>
          <section className="group-action">
            <Tooltip title="Add a task">
              <IconButton onClick={() => this.createMode = true}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete group" onClick={() => this.confirmDelete = true}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </section>
        </header>
        {this.createMode && <NewTask groupId={this.props.id} refresh={() => this.getTasks()} cancelCreation={() => this.createMode = false} />}
        {this.noContent}
        {this.tasksRender}
      </Paper>
    )
  }
}

export const Group = withSnackbar(GroupComponent);
