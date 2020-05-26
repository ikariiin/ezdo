import * as React from 'react';
import { Typography, Paper, IconButton, Tooltip } from '@material-ui/core';
import "../scss/group.scss";
import AddIcon from '@material-ui/icons/AddTwoTone';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { NewTask } from './new-task';
import { Todo } from '../../../../backend/entities/todo';
import { API_HOST, API_TODOS } from '../../util/api-routes';
import { Task } from './task';

export interface TasksProps {
  title: string;
  id: number;
}

@observer
export class Group extends React.Component<TasksProps> {
  @observable private createMode: boolean = false;
  @observable private tasks: Array<Todo> = [];

  private async getTasks(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_TODOS}/${this.props.id}/all`, {
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ""
      }
    });
    
    const responseJSON = await response.json();

    if(responseJSON.failed) {
      console.error(responseJSON);
      return;
    }

    this.tasks = responseJSON;
  }

  public componentDidMount() {
    this.getTasks();
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
    if(this.tasks.length === 0) return;

    return this.tasks.map(task => (
      <Task {...task} refresh={() => this.getTasks()} key={task.id} />
    ));
  }
  
  public render() {
    return (
      <Paper className="group" elevation={2}>
        <header className="group-header">
          <Typography variant="h5" className="title">{this.props.title}</Typography>
          <section className="group-action">
            <Tooltip title="Add a task">
              <IconButton onClick={() => this.createMode = true}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete group (permanent)">
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