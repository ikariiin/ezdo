import * as React from 'react';
import { Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon, Tooltip } from '@material-ui/core';
import { Todo } from '../../../../backend/entities/todo';
import * as moment from 'moment';
import "../scss/task.scss";
import MoreIcon from '@material-ui/icons/MoreVertOutlined';
import ArchiveIcon from '@material-ui/icons/ArchiveOutlined';
// @ts-ignore
import UnArchiveIcon from '@material-ui/icons/UnArchiveOutlined';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { TaskLabel } from './task-label';
import { TaskMenu } from './task-menu';
import { API_HOST, API_TODO_DELETE, API_TODOS } from '../../util/api-routes';
import { TaskDeleteConfirm } from './dialogs/task-delete-confirm'
import { TaskEdit } from './task-edit';
import { TaskMove } from './dialogs/task-move';
import { Highlight } from '../../common/components/highlight';
import { WithSnackbarProps, withSnackbar } from 'notistack';

export interface TaskProps extends Todo, WithSnackbarProps {
  refresh: () => void;
  refreshGroup: (id: number) => any;
  isArchive?: boolean;
  taskHighlight?: string;
  labelHighlight?: string;
}

@observer
class TaskComponent extends React.Component<TaskProps> {
  @observable private anchorEl: HTMLButtonElement|null = null;
  @observable private timeFromNow: string = "";
  @observable private deleteDialog: boolean = false;
  @observable private editTask: boolean = false;
  @observable private moveTaskDialog: boolean = false;

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
          Expired on {moment(this.props.dueDate).format("MMMM Do YYYY, h:mm a")}
          {
            this.props.group === -1 && (
              <div className="archive-notice">Task has been archived</div>
            )
          }
        </time>
      );
    }

    return (
      <time className="date">
        Due on {moment(this.props.dueDate).format("MMMM Do YYYY, h:mm a")}
        <br />
        or, due {this.timeFromNow.includes("minutes") ? <span className="warn">{this.timeFromNow}</span> : this.timeFromNow}
        {
          this.props.group === -1 && (
            <div className="archive-notice">Task has been archived</div>
          )
        }
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

    const responseJSON = await response.json();
    if(responseJSON.failed) {
      console.error(responseJSON);
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }

    this.props.enqueueSnackbar("Task deleted successfully.", {
      variant: "info"
    });
    this.deleteDialog = false;
    this.anchorEl = null;
    this.props.refresh();
  }

  @action private closeDialogue(): void {
    this.deleteDialog = false;
  }

  @action private openEditTask(): void {
    this.editTask = true;
    this.anchorEl = null;
  }

  private editDone(): void {
    this.editTask = false;
    this.props.refresh();
  }

  @action private openMoveMenu(): void {
    this.moveTaskDialog = true;
    this.anchorEl = null;
  }

  @action private openDeleteDialog(): void {
    this.deleteDialog = true;
    this.anchorEl = null;
  }

  private async archiveTask(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_TODOS}/${this.props.id}/archive`, {
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem('jwtKey') || ''
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

    this.props.enqueueSnackbar("Task archived.", {
      variant: "info"
    });
    this.props.refresh();
  }

  public render() {
    if(this.editTask) {
      return <TaskEdit done={() => this.editDone()} todoId={this.props.id} onCancel={() => this.editTask = false} />;
    }

    return (
      <Paper className={`task ${this.isExpired() && 'expired'} ${this.props.group === -1 && 'archived'}`} elevation={0}>
        <TaskDeleteConfirm
          onClose={() => this.closeDialogue()}
          close={() => this.closeDialogue()}
          open={this.deleteDialog}
          onDelete={() => this.deleteTask()} />
        <TaskMove
          open={this.moveTaskDialog}
          todoId={this.props.id}
          onClose={() => this.moveTaskDialog = false}
          close={() => this.moveTaskDialog = false}
          refreshGroup={this.props.refreshGroup}
          currentGroupId={this.props.group} />
        <header className="task-header">
          {this.timeRender}
          {!this.props.isArchive && this.props.group !== -1 && (
            <Tooltip title="Archive">
              <IconButton size="small" onClick={() => this.archiveTask()}>
                <ArchiveIcon />
              </IconButton>
            </Tooltip>
          )}
          {this.props.group === -1 && (
            <Tooltip title="Un-archive">
              <IconButton size="small" onClick={() => this.openMoveMenu()}>
                <UnArchiveIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="More actions">
            <IconButton size="small" onClick={ev => this.openMenu(ev)}>
              <MoreIcon />
            </IconButton>
          </Tooltip>
          <TaskMenu
            anchorEl={this.anchorEl}
            open={Boolean(this.anchorEl)}
            onDelete={() => this.openDeleteDialog()}
            onEdit={() => this.openEditTask()}
            onMove={() => this.openMoveMenu()}
            onClose={() => this.closeMenu()} />
        </header>
        <Typography variant="body2" className="task-text">
          {this.props.taskHighlight ? (
            <Highlight
              text={this.props.task}
              highlight={this.props.taskHighlight} />
          ) : this.props.task}
        </Typography>
        <TaskLabel
          refresh={this.props.refresh}
          groupId={this.props.group}
          labelHighlight={this.props.labelHighlight}
          todoId={this.props.id}
          label={this.props.label} />
      </Paper>
    );
  }
}

export const Task = withSnackbar(TaskComponent);
