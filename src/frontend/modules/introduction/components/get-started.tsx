import * as React from 'react';
import { Typography } from '@material-ui/core';
import "../scss/get-started.scss";

export const GetStarted: React.FunctionComponent<{}> = (): JSX.Element => (
  <section className="get-started-intro">
    <Typography variant="h6">
      Let's get started!
    </Typography>
    <section className="col-layout">
      <section className="text">
        <Typography variant="body1">
          When you first login, you should be able to see a screen like this.
          Well in this case, this should be just behind this dialog 😃.
        </Typography>
        <Typography variant="body1">
          Clicking on the hamburger icon, will open the drawer with all the pages
          that you can navigate to.
        </Typography>
      </section>
      <section className="screenshot">
        <div className="landing-screenshot" />
      </section>
    </section>
  </section>
);