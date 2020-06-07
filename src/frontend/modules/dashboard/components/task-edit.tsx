import * as React from 'react';
import { Paper, Typography, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import "../scss/task-edit.scss";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { API_TODOS, API_HOST } from '../../util/api-routes';
import { Todo } from '../../../../backend/entities/todo';
import { DateTimePicker } from '@material-ui/pickers';
import EditIcon from '@material-ui/icons/EditTwoTone';
import CancelIcon from '@material-ui/icons/CloseRounded';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { ImageUploader } from './image-uploader/image-uploader';

export interface TaskEditProps extends WithSnackbarProps {
  done: () => any;
  todoId: number;
  onCancel: () => any;
}

@observer
class TaskEditComponent extends React.Component<TaskEditProps> {
  @observable private task: string = "";
  @observable private dueDate: Date = new Date();
  @observable private taskImages: Array<number> = [];
  @observable private imageUploadInProgress: boolean = false;
  @observable private submitting: boolean = false;

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
    if(!todo.images) {
      this.taskImages = [];
    } else {
      this.taskImages.push(...todo.images.split(',').map(id => Number(id)));
    }
  }

  public componentDidMount() {
    this.fetchTodo();
  }

  private async editTask(): Promise<void> {
    this.submitting = true;
    const response = await fetch(`${API_HOST}${API_TODOS}/${this.props.todoId}`, {
      headers: {
        Authorization: localStorage.getItem('jwtKey') || '',
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify({ dueDate: this.dueDate, task: this.task, images: this.taskImages.join(',') })
    });

    const responseJSON = await response.json();
    this.submitting = false;
    
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
          margin="normal"
        />
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
          onChange={date => this.dueDate = !date ? new Date() : date?.toDate()}
        />
        <ImageUploader
          attachImage={id => this.taskImages.push(id)}
          removeImage={id => this.taskImages = this.taskImages.filter(imageId => imageId !== id)}
          changeUploadProgress={(progress: boolean) => this.imageUploadInProgress = progress} 
          images={this.taskImages}
        />
        <section className="button-container">
          <Button variant="outlined" color="primary" size="small" onClick={this.props.onCancel}>
            <CancelIcon />
            Cancel
          </Button>
          <Button variant="contained" size="small" color="secondary" onClick={() => this.editTask()} disabled={this.imageUploadInProgress || this.submitting}>
            {this.submitting ? "Submitting..." : (
              <>
                <EditIcon />
                Save task
              </>
            )}
          </Button>
        </section>
      </Paper>
    );
  }
}

export const TaskEdit = withSnackbar(TaskEditComponent);