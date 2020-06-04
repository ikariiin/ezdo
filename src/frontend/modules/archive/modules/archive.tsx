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
import { RoutesProps } from '../../root/components/routes';
import { ArchiveClearConfirm } from './archive-clear-confirm';
import { Skeleton } from '@material-ui/lab';

@observer
class ArchiveComponent extends React.Component<WithSnackbarProps & RoutesProps> {
  @observable private tasks: Array<Todo> = [];
  @observable private notAuthorized: boolean = false;
  @observable private clearConfirm: boolean = false;
  @observable private loading: boolean = false;

  private async fetchArchives(): Promise<void> {
    this.loading = true;
    const response = await fetch(`${API_HOST}${API_GROUPS}/-1`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem('jwtKey') || ''
      }
    });

    const responseJSON = await response.json();
    this.loading = false;
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
    this.clearConfirm = false;
  }

  public componentDidMount() {
    this.fetchArchives();
    if(!localStorage.getItem("jwtKey")) {
      this.notAuthorized = true;
    }
    this.props.changeTitle("Archive");
  }

  @computed private get renderEmptyArchive(): React.ReactNode {
    if(this.tasks.length !== 0 || this.loading) return null;

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
        <ArchiveClearConfirm
          open={this.clearConfirm}
          close={() => this.clearConfirm = false}
          onClose={() => this.clearConfirm = false}
          confirm={() => this.clearArchives()} />
        {this.notAuthorized && <Redirect to="/login" />}
        <section className="header">
          <div className="space" />
          <Button disabled={this.tasks.length === 0} variant="contained" color="primary" size="large" onClick={() => this.clearConfirm = true}>
            Clear Archive
          </Button>
        </section>
        {this.renderEmptyArchive}
        <main className="tasks">
          {this.loading && (
            <>
              <Skeleton variant="rect" className="skeleton-task" animation="wave" />
              <Skeleton variant="rect" className="skeleton-task" animation="wave" />
              <Skeleton variant="rect" className="skeleton-task" animation="wave" />
            </>
          )}
          {this.tasks.map(task => (
            <Task {...task} isArchive refresh={() => this.fetchArchives()} refreshGroup={() => this.fetchArchives()} key={task.id} />
          ))}
        </main>
      </section>
    );
  }
}

export const Archive = withSnackbar(ArchiveComponent);