import * as React from 'react';
import { observable, computed } from 'mobx';
import { Todo } from '../../../../backend/entities/todo';
import { API_HOST, API_GROUPS } from '../../util/api-routes';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { Task } from '../../dashboard/components/task';
import { observer } from 'mobx-react';
import "../scss/tasks.scss";
import { RoutesProps } from '../../root/components/routes';
import { Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export interface TasksProps extends WithSnackbarProps, RoutesProps {
  groupId: number;
}

@observer
class TasksComponent extends React.Component<TasksProps> {
  @observable private tasks: Array<Todo> = [];
  @observable private loading: boolean = false;

  private async fetchTasks(): Promise<void> {
    this.loading = true;
    if(this.tasks.length !== 0) {
      this.props.enqueueSnackbar("Refreshing...", {
        variant: "default",
        autoHideDuration: 2000
      });
    }
    const response = await fetch(`${API_HOST}${API_GROUPS}/${this.props.groupId}`, {
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ''
      }
    });

    const responseJSON = await response.json();
    this.loading = false;
    if(responseJSON.failed) {
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      console.error(responseJSON);
      return;
    }

    this.tasks = responseJSON.tasks;
  }

  public componentDidMount() {
    this.fetchTasks();
  }

  public componentDidUpdate(prevProps: TasksProps) {
    if(this.props.groupId !== prevProps.groupId) {
      this.fetchTasks();
    }
  }

  @computed get noTasksRender(): React.ReactNode {
    if(this.tasks.length !== 0 || this.loading) {
      return null;
    }

    return (
      <section className="no-results">
        <div className="illustration" />
        <Typography variant="h6">
          Seems like there's no tasks in this group yet.
        </Typography>
      </section>
    );
  }

  public render() {
    return (
      <>
        {this.noTasksRender}
        <section className="tasks-group">
            {this.loading && this.tasks.length === 0 && (
              <>
                <Skeleton variant="rect" animation="wave" className="task-skeleton" />
                <Skeleton variant="rect" animation="wave" className="task-skeleton" />
                <Skeleton variant="rect" animation="wave" className="task-skeleton" />
              </>
            )}
            {this.tasks.map(task => (
              <Task {...task} refresh={() => this.fetchTasks()} refreshGroup={() => this.fetchTasks()} />
            ))}
        </section>
      </>
    )
  }
}

export const Tasks = withSnackbar(TasksComponent);