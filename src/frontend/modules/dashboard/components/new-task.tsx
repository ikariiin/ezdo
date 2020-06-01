import * as React from 'react';
import { Paper, Typography, TextField, Button } from '@material-ui/core';
import "../scss/new-task.scss";
import AddIcon from '@material-ui/icons/AddTwoTone';
import CancelIcon from '@material-ui/icons/CloseRounded';
import { API_HOST, API_TODO_CREATE } from '../../util/api-routes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { DateTimePicker } from '@material-ui/pickers';
import { WithSnackbarProps, withSnackbar } from 'notistack';

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

  private resetState(): void {
    this.task = "";
    this.label = "";
    this.dueDate = new Date();
  }

  private async createTask(): Promise<void> {
    if(this.task.trim().length === 0) {
      // snackbar time!
      this.props.enqueueSnackbar("Cannot create an empty task!", {
        variant: "info"
      });
      return;
    }

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
        label: this.label
      })
    });

    const responseJSON = await response.json();
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
          onChange={date => this.dueDate = date?.toDate()} />
        
        <section className="button-container">
          <Button variant="text" color="primary" size="small" onClick={this.props.cancelCreation}>
            <CancelIcon />
            Cancel
          </Button>
          <Button variant="contained" size="small" color="secondary" onClick={() => this.createTask()}>
            <AddIcon />
            Add task
          </Button>
        </section>
      </Paper>
    )
  }
}

export const NewTask = withSnackbar(NewTaskComponent);