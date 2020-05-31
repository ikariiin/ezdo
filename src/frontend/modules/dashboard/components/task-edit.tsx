import * as React from 'react';
import { Paper, Typography, TextField, Button } from '@material-ui/core';
import "../scss/task-edit.scss";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { API_TODOS, API_HOST } from '../../util/api-routes';
import { Todo } from '../../../../backend/entities/todo';
import { DateTimePicker } from '@material-ui/pickers';
import EditIcon from '@material-ui/icons/EditTwoTone';
import CancelIcon from '@material-ui/icons/CloseRounded';
import { WithSnackbarProps, withSnackbar } from 'notistack';

export interface TaskEditProps extends WithSnackbarProps {
  done: () => any;
  todoId: number;
  onCancel: () => any;
}

@observer
class TaskEditComponent extends React.Component<TaskEditProps> {
  @observable private task: string = "";
  @observable private dueDate: Date = new Date();

  private async fetchTodo(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_TODOS}/${this.props.todoId}`, {
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

    const todo: Todo = responseJSON.todo;
    this.task = todo.task;
    this.dueDate = todo.dueDate;
  }

  public componentDidMount() {
    this.fetchTodo();
  }

  private async editTask(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_TODOS}/${this.props.todoId}`, {
      headers: {
        Authorization: localStorage.getItem('jwtKey') || '',
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify({ dueDate: this.dueDate, task: this.task })
    });

    const responseJSON = await response.json();
    
    if(responseJSON.failed) {
      console.error(responseJSON);
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }

    console.log(responseJSON);
    this.props.done();
  }

  public render() {
    return (
      <Paper className="task-edit" elevation={0}>
        <Typography variant="h6">Edit task</Typography>
        <TextField
          variant="outlined"
          label="Task"
          onChange={ev => this.task = ev.target.value}
          value={this.task}
          size="small"
          fullWidth
          multiline
          autoFocus
          margin="normal" />
        
        <DateTimePicker
          variant="inline"
          format="MMMM Do YYYY, h:mm a"
          margin="normal"
          label="Due Date"
          minDate={new Date()}
          value={this.dueDate}
          fullWidth
          size="small"
          color="primary"
          inputVariant="outlined"
          onChange={date => this.dueDate = !date ? new Date() : date?.toDate()} />
        
        <section className="button-container">
          <Button variant="text" color="primary" size="small" onClick={this.props.onCancel}>
            <CancelIcon />
            Cancel
          </Button>
          <Button variant="contained" size="small" color="secondary" onClick={() => this.editTask()}>
            <EditIcon />
            Edit task
          </Button>
        </section>
      </Paper>
    );
  }
}

export const TaskEdit = withSnackbar(TaskEditComponent);