import * as React from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import "../scss/group-placeholder.scss";
import AddIcon from '@material-ui/icons/AddOutlined';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRightTwoTone';
import { API_GROUPS, API_HOST } from '../../util/api-routes';
import { WithSnackbarProps, withSnackbar } from 'notistack';

export interface GroupPlaceholderProps extends WithSnackbarProps {
  refresh: () => void;
  className?: string;
  createMode?: boolean;
}

@observer
class GroupPlaceholderComponent extends React.Component<GroupPlaceholderProps> {
  @observable private editMode: boolean = false;
  @observable private groupName: string = "";
  @observable private submitting: boolean = false;

  private resetState(): void {
    this.editMode = false;
    this.groupName = '';
  }

  private async createGroup(): Promise<void> {
    if(this.groupName.trim().length === 0) {
      this.props.enqueueSnackbar("Group name cannot be empty or entirely spaces.", {
        variant: "error"
      });
      return;
    }
    this.submitting = true;
    const response = await fetch(`${API_HOST}${API_GROUPS}`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem('jwtKey') || '',
        "Content-Type": "application/json"
      },
       body: JSON.stringify({
         name: this.groupName
       })
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

    this.props.enqueueSnackbar(`Created group "${this.groupName}" successfully.`, {
      variant: "success"
    });
    this.props.refresh();
    this.resetState();
  }

  @action private closeEditMode(ev: React.MouseEvent<HTMLButtonElement>): void {
    ev.stopPropagation();
    this.editMode = false;
  }

  @computed public get content(): JSX.Element {
    if(!this.editMode) return (
      <>
        <Typography variant="h4" className="heading">
          <AddIcon className="add-icon" />
          Create a group
        </Typography>
        <br />
        <Typography variant="subtitle2">
          To organize your tasks. Click to get started.
        </Typography>
      </>
    );

    return (
      <form className="edit-form" onSubmit={(ev) => { this.createGroup(); ev.preventDefault(); }}>
        <TextField
          placeholder="F.ex. In Progress, or Completed"
          fullWidth
          value={this.groupName}
          variant="outlined"
          onChange={ev => this.groupName = ev.target.value}
          helperText="A short but informative name works the best!"
          autoFocus
          label="Group Name" />
        <br />
        <br />
        <Button variant="text" onClick={(ev: React.MouseEvent<HTMLButtonElement>) => this.closeEditMode(ev)}>
          Cancel
        </Button>
        <Button variant="text" color="secondary" type="submit" disabled={this.submitting}>
          {this.submitting ? "Submitting.." : (
            <>
              Create group <ArrowRightIcon />
            </>
          )}
        </Button>
      </form>
    );
  }

  @action public componentDidMount() {
    if(this.props.createMode) {
      this.editMode = true;
    }
  }

  public render() {
    return (
      <section className={`group-placeholder ${this.editMode && 'edit-mode'} ${this.props.className}`} onClick={() => { if(!this.editMode) { this.editMode = true } }}>
        {this.content}
      </section>
    );
  }
}

export const GroupPlaceholder = withSnackbar(GroupPlaceholderComponent);