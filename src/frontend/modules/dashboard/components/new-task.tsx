import * as React from 'react';
import { Paper, Typography, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import "../scss/new-task.scss";
import AddIcon from '@material-ui/icons/AddTwoTone';
import CancelIcon from '@material-ui/icons/CloseRounded';
import { API_HOST, API_TODO_CREATE } from '../../util/api-routes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { DateTimePicker } from '@material-ui/pickers';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { ImageUploader } from './image-uploader/image-uploader';

export interface NewTaskProps extends WithSnackbarProps {
  refresh: () => void;
  groupId: number;
  cancelCreation: () => void;
}

@observer
class NewTaskComponent extends React.Component<NewTaskProps> {
  @observable private task: string = "";
  @observable private label: string = "";
  @observable private dueDate?: Date = new Date();
  @observable private addImage: boolean = false;
  @observable private attachedImages: Array<number> = [];
  @observable private imageUploadInProgress: boolean = false;
  @observable private creating: boolean = false;

  private resetState(): void {
    this.task = "";
    this.label = "";
    this.dueDate = new Date();
    this.attachedImages = [];
    this.imageUploadInProgress = false;
    this.addImage = false;
    this.creating = false;
  }

  private async createTask(): Promise<void> {
    if(this.task.trim().length === 0) {
      // snackbar time!
      this.props.enqueueSnackbar("Cannot create an empty task!", {
        variant: "info"
      });
      return;
    }
    this.creating = true;

    const response = await fetch(`${API_HOST}${API_TODO_CREATE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('jwtKey') || ''
      },
      body: JSON.stringify({
        date: this.dueDate,
        groupId: this.props.groupId,
        task: this.task,
        label: this.label,
        images: this.attachedImages.join(",")
      })
    });

    const responseJSON = await response.json();
    this.creating = false;
    if(responseJSON.failed) {
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      console.error(responseJSON);
      return;
    }

    this.props.enqueueSnackbar("Created new task successfully.", {
      variant: "success"
    });
    this.props.refresh();
    this.resetState();
    this.props.cancelCreation();
  }

  public render() {
    return (
      <Paper elevation={0} className="new-task">
        <Typography variant="h6">Add a Task</Typography>
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
          onChange={date => this.dueDate = date?.toDate()}
        />
        <FormControlLabel
          label="Add Images"
          control={<Checkbox color="secondary" onClick={() => this.addImage = !this.addImage} value={this.addImage} />}
        /> 
        {this.addImage && (
          <ImageUploader
            attachImage={id => this.attachedImages.push(id)}
            removeImage={id => this.attachedImages = this.attachedImages.filter(imageId => imageId !== id)}
            changeUploadProgress={(progress: boolean) => this.imageUploadInProgress = progress}
          />
        )}
        <section className="button-container">
          <Button variant="outlined" color="primary" size="small" onClick={this.props.cancelCreation}>
            <CancelIcon />
            Cancel
          </Button>
          <Button variant="contained" size="small" color="secondary" onClick={() => this.createTask()} disabled={this.imageUploadInProgress || this.creating}>
            {this.creating ? "Creating..." : (
              <>
                <AddIcon />
                Add Task
              </>
            )}
          </Button>
        </section>
      </Paper>
    )
  }
}

export const NewTask = withSnackbar(NewTaskComponent);