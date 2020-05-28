import * as React from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import "../scss/group-placeholder.scss";
import AddIcon from '@material-ui/icons/AddOutlined';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRightTwoTone';
import { API_GROUPS, API_HOST } from '../../util/api-routes';

export interface GroupPlaceholderProps {
  refresh: () => void;
}

@observer
export class GroupPlaceholder extends React.Component<GroupPlaceholderProps> {
  @observable private editMode: boolean = false;
  @observable private groupName: string = "";

  private resetState(): void {
    this.editMode = false;
    this.groupName = '';
  }

  private async createGroup(): Promise<void> {
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
    console.log(await response.json());

    this.props.refresh();
    this.resetState();
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
      <section className="edit-form">
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
        <Button variant="text" color="secondary" onClick={() => this.createGroup()}>
          Create group <ArrowRightIcon />
        </Button>
      </section>
    );
  }

  public render() {
    return (
      <section className={`group-placeholder ${this.editMode && 'edit-mode'}`} onClick={() => this.editMode = true}>
        {this.content}
      </section>
    );
  }
}