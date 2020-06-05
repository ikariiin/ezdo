import * as React from 'react';
import { Typography } from '@material-ui/core';
import "../scss/archive-intro.scss";

export const ArchiveIntro: React.FunctionComponent<{}> = (): JSX.Element => (
  <section className="archive-intro">
    <Typography variant="h6">Archives</Typography>
    <section className="col-layout">
      <section className="text">
        <Typography variant="body1">
          You can archive a task by clicking the archive icon on a task.
        </Typography>
        <Typography variant="body1">
          If you navigate to the archive page from the drawer you will be
          able to see all the archived tasks, and clear them out as well!
        </Typography>
      </section>
      <section className="image">
        <div className="archive-screenshot" />
      </section>
    </section>
  </section>
);