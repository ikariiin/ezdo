import * as React from 'react';
import { Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { Todo } from '../../../../backend/entities/todo';
import * as moment from 'moment';
import "../scss/task.scss";
import MoreIcon from '@material-ui/icons/MoreVertOutlined';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { TaskLabel } from './task-label';
import { TaskMenu } from './task-menu';
import { API_HOST, API_TODO_DELETE } from '../../util/api-routes';
import { TaskDeleteConfirm } from './dialogs/task-delete-confirm'
import { TaskEdit } from './task-edit';

export interface TaskProps extends Todo {
  refresh: () => void;
}

@observer
export class Task extends React.Component<TaskProps> {
  @observable private anchorEl: HTMLButtonElement|null = null;
  @observable private timeFromNow: string = "";
  @observable private openDeleteDialouge: boolean = false;
  @observable private editTask: boolean = false;

  private openMenu(ev: React.MouseEvent<HTMLButtonElement>): void {
    this.anchorEl = ev.currentTarget;
  }

  private closeMenu(): void {
    this.anchorEl = null;
  }

  private isExpired(): boolean {
    return (new Date()).getTime() - (new Date(this.props.dueDate)).getTime() > 0;
  }

  private get timeRender(): React.ReactNode {
    if(this.isExpired()) {
      return ( 
        <time className="date">
          Already expired on {moment(this.props.dueDate).format("MMMM Do YYYY, h:mm:ss a")}!
        </time>
      );
    }

    return (
      <time className="date">
        Due by {moment(this.props.dueDate).format("MMMM Do YYYY, h:mm:ss a")}
        <br />
        or, due {this.timeFromNow.includes("minutes") ? <span className="warn">{this.timeFromNow}</span> : this.timeFromNow}
      </time>
    );
  }

  @action private updateTimeFromNow() {
    setInterval(() => this.timeFromNow = moment(this.props.dueDate).fromNow(), 1000);
  }

  public componentDidMount() {
    this.timeFromNow = moment(this.props.dueDate).fromNow();
    this.updateTimeFromNow();
  }

  @action private async deleteTask(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_TODO_DELETE}/${this.props.id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem('jwtKey') || ''
      }
    });

    console.log(await response.json());
    this.openDeleteDialouge = false;
    this.anchorEl = null;
    this.props.refresh();
  }

  @action private closeDialogue(): void {
    this.openDeleteDialouge = false;
    this.anchorEl = null;
  }

  @action private openEditTask(): void {
    this.editTask = true;
    this.anchorEl = null;
  }

  private editDone(): void {
    this.editTask = false;
    this.props.refresh();
  }

  public render() {
    if(this.editTask) {
      return <TaskEdit done={() => this.editDone()} todoId={this.props.id} onCancel={() => this.editTask = false} />;
    }

    return (
      <Paper className={`task ${this.isExpired() && 'expired'}`} elevation={0}>
        <TaskDeleteConfirm
          onClose={() => this.closeDialogue()}
          close={() => this.closeDialogue()}
          open={this.openDeleteDialouge}
          onDelete={() => this.deleteTask()} />
        <header className="task-header">
          {this.timeRender}
          <IconButton size="small" onClick={ev => this.openMenu(ev)}>
            <MoreIcon />
          </IconButton>
          <TaskMenu
            anchorEl={this.anchorEl}
            open={Boolean(this.anchorEl)}
            onDelete={() => this.openDeleteDialouge = true}
            onEdit={() => this.openEditTask()}
            onClose={() => this.closeMenu()} />
        </header>
        <Typography variant="body2" className="task-text">
          {this.props.task}
        </Typography>
        <TaskLabel
          refresh={this.props.refresh}
          groupId={this.props.group}
          todoId={this.props.id}
          label={this.props.label} />
      </Paper>
    )
  }
}