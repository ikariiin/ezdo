import * as React from 'react';
import { Typography, Button } from '@material-ui/core';
import "../scss/archive.scss";
import { API_HOST, API_GROUPS } from '../../util/api-routes';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Todo } from '../../../../backend/entities/todo';
import { Task } from '../../dashboard/components/task';

@observer
export class Archive extends React.Component<{}> {
  @observable private tasks: Array<Todo> = [];

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
      return;
    }

    this.fetchArchives();
  }

  public componentDidMount() {
    this.fetchArchives();
  }

  public render() {
    return (
      <section className="archive">
        <section className="header">
          <Typography variant="h4">
            Archive
          </Typography>
          <div className="space" />
          <Button variant="text" color="secondary" size="large" onClick={() => this.clearArchives()}>
            Clear Archive
          </Button>
        </section>
        <main className="tasks">
          {this.tasks.map(task => (
            <Task {...task} refresh={() => this.fetchArchives()} refreshGroup={() => this.fetchArchives()} />
          ))}
        </main>
      </section>
    );
  }
}