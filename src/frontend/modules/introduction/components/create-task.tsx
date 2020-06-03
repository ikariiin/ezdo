import * as React from 'react';
import { Typography } from '@material-ui/core';
import "../scss/create-task.scss";

export const CreateTask: React.FunctionComponent<{}> = (): JSX.Element => (
  <section className="create-task-intro">
    <Typography variant="h6">
      Creating a task!
    </Typography>
    <section className="col-layout">
      <section className="text">
        <Typography variant="body1">
          Creating a task is as simple as clicking the Add Task button on top
          of the group. Don't worry though, you can move this task after this to any
          other groups created as well. Write the task down, and the due date,
          hit the Create Task button!
        </Typography>
        <Typography variant="body2">
          Managing tasks is as easy as clicking the Menu Icon and simply clicking
          the option.
        </Typography>
      </section>
      <section className="image">
        <div className="task-screenshot" />
      </section>
    </section>
  </section>
);