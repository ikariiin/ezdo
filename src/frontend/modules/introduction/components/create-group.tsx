import * as React from 'react';
import { Typography } from '@material-ui/core';
import "../scss/create-group.scss";

export const CreateGroup: React.FunctionComponent<{}> = (): JSX.Element => (
  <section className="create-group-intro">
    <Typography variant="h6">Create a group to manage your tasks!</Typography>
    <section className="col-layout">
      <section className="text">
        <Typography variant="body1">
          To create a group, simply click on the big + Add Group button.
          After that you'd be asked for the name of the group, and hit enter
          or click on the Create Group button to finish creating a group.
        </Typography>
        <br />
        <Typography variant="body1">
          You should be greeted with a brand new Group for tasks after that
          right in your dashboard!
        </Typography>
      </section>
      <section className="image">
        <div className="group-screenshot" />
      </section>
    </section>
  </section>
);