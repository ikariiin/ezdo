import * as React from 'react';
import { Typography, Button } from '@material-ui/core';
import "../scss/archive.scss";
import { API_HOST, API_GROUPS } from '../../util/api-routes';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { Todo } from '../../../../backend/entities/todo';
import { Task } from '../../dashboard/components/task';
import { Redirect } from 'react-router-dom';
import { WithSnackbarProps, withSnackbar } from 'notistack';

@observer
class ArchiveComponent extends React.Component<WithSnackbarProps> {
  @observable private tasks: Array<Todo> = [];
  @observable private notAuthorized: boolean = false;

  private async fetchArchives(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_GROUPS}/-1`, {
      method: "GET",
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

    this.tasks = responseJSON.tasks;
  }

  private async clearArchives(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_GROUPS}/archive`, {
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

    this.fetchArchives();
  }

  public componentDidMount() {
    this.fetchArchives();
    if(!localStorage.getItem("jwtKey")) {
      this.notAuthorized = true;
    }
  }

  @computed private get renderEmptyArchive(): React.ReactNode {
    if(this.tasks.length !== 0) return null;

    return (
      <section className="empty-archives">
        <div className="illustration" />
        <Typography variant="h6">
          Looks like the archives are incomplete...
        </Typography>
      </section>
    );
  }

  public render() {
    return (
      <section className="archive">
        {this.notAuthorized && <Redirect to="/login" />}
        <section className="header">
          <Typography variant="h4">
            Archive
          </Typography>
          <div className="space" />
          <Button disabled={this.tasks.length === 0} variant="text" color="secondary" size="large" onClick={() => this.clearArchives()}>
            Clear Archive
          </Button>
        </section>
        {this.renderEmptyArchive}
        <main className="tasks">
          {this.tasks.map(task => (
            <Task {...task} isArchive refresh={() => this.fetchArchives()} refreshGroup={() => this.fetchArchives()} />
          ))}
        </main>
      </section>
    );
  }
}

export const Archive = withSnackbar(ArchiveComponent);