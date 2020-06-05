import * as React from 'react';
import { observer } from 'mobx-react';
import { Chip, TextField, InputAdornment, IconButton, Tooltip } from '@material-ui/core';
import { computed, observable, action } from 'mobx';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/CloseOutlined';
import "../scss/task-label.scss";
import { API_HOST, API_TODO_LABEL, API_TODOS } from '../../util/api-routes';
import { WithSnackbarProps, withSnackbar } from 'notistack';

export interface TaskLabelProps extends WithSnackbarProps {
  groupId: number;
  label?: string;
  todoId: number;
  refresh: () => void;
  labelHighlight?: string;
}

@observer
class TaskLabelComponent extends React.Component<TaskLabelProps> {
  @observable private labelInput: boolean = false;
  @observable private newLabel: string = '';
  @observable deletingIndex?: number; 
  @observable tempAdditionLabel?: string;

  private async deleteLabel(labelKey: number): Promise<void> {
    this.deletingIndex = labelKey;
    const response = await fetch(`${API_HOST}${API_TODOS}/${this.props.todoId}/label/${labelKey}`, {
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

    this.props.enqueueSnackbar("Deleted label successfully.", {
      variant: "info"
    });
    console.log(responseJSON);
    this.deletingIndex = undefined;
    this.props.refresh();
  }

  @computed private get labels(): React.ReactNode {
    if(!this.props.label) {
      return <Chip
        key="add-label"
        onClick={() => this.labelInput = true} size="small"
        icon={<AddIcon />} variant="outlined" className="label-chip"
        label="Add a label" color="default" />;
    }
    
    // We create an array, and destructure the filtered `Chip` components into it, and add
    // the create button as well
    return [
      ...this.props.label.split('//')
       .filter(label => label.trim().length !== 0)
       .map((label, key) => (
         <Chip
          variant={this.props.labelHighlight ? "default" : "outlined"} size="small"
          label={label} color={this.props.labelHighlight || this.deletingIndex === key ? "primary" : "default"}
          key={`${this.deletingIndex === key ? 'Deleting: ' : ''}${label}`} className="label-chip"
          onDelete={() => this.deleteLabel(key)} />
       )),
      <Chip
        key="add-label"
        onClick={() => this.labelInput = true} size="small"
        icon={<AddIcon />} variant="outlined" className="label-chip"
        label="Add label" color="default" />
    ];
  }

  @action private async addLabel(): Promise<void> {
    if(this.newLabel.trim().length === 0) {
      this.props.enqueueSnackbar("Label cannot be empty or entirely spaces.", {
        variant: "error"
      });
      return;
    }
    this.labelInput = false;
    // Shhhhh. :P
    const newLabelStr = this.props.label === '' ? this.newLabel.replace(/\/\//g, "\\\\") : `${this.props.label}//${this.newLabel.replace(/\//g, "\\\\")}`;
    this.tempAdditionLabel = this.newLabel.replace(/\//g, "\\\\");
    const response = await fetch(`${API_HOST}${API_TODO_LABEL}/${this.props.todoId}`, {
      method: "PUT",
      headers: {
        Authorization: localStorage.getItem('jwtKey') || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ labelStr: newLabelStr })
    });

    const responseJSON = await response.json();
    if(responseJSON.failed) {
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      console.error(responseJSON);
      this.labelInput = true;
      return;
    }

    this.props.enqueueSnackbar("Label added successfully.", {
      variant: "success"
    });

    this.tempAdditionLabel = undefined;
    this.newLabel = '';
    this.props.refresh();
  }

  @computed private get labelEdit(): React.ReactNode {
    if(this.labelInput) {
      return (
        <form onSubmit={(ev) => { ev.preventDefault(); this.addLabel(); }} style={{ width: '100%' }}>
          <TextField fullWidth size="small" variant="outlined" margin="normal" autoFocus label="Label" InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Add label">
                  <IconButton size="small" onClick={() => this.addLabel()}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                  <IconButton size="small" onClick={() => {this.labelInput = false; this.newLabel = '';}}>
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )
          }} onChange={ev => this.newLabel = ev.target.value} value={this.newLabel} />
        </form>
      );
    }

    return null;
  }

  @computed private get tempLabels(): React.ReactNode {
    if(!this.tempAdditionLabel) return null;

    return <Chip className="label-chip" size="small" color="secondary" label={`Adding: ${this.tempAdditionLabel}...`} />;
  }

  public render() {
    return (
      <section className="task-label-control">
        {this.tempLabels}
        {this.labels}
        <br />
        {this.labelEdit}
      </section>
    )
  }
}

export const TaskLabel = withSnackbar(TaskLabelComponent);