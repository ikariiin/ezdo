import * as React from 'react';
import { Typography } from '@material-ui/core';
import "../scss/complete-intro.scss";

export const CompleteIntro: React.FunctionComponent<{}> = (): JSX.Element => (
  <section className="complete-intro">
    <Typography variant="h6">That is indeed it!</Typography>
    <section className="col-layout">
      <Typography className="body2">
        That is it for the introduction to EZDo! Hope you enjoy your stay.
        If there are any issues, you can always create an issue in the issue tracker
        at <a target="__blank" href="https://github.com/SaitamaSama/ezdo-hackerearth/issues">SaitamaSama/ezdo-hackerearth</a>!
      </Typography>
      <section className="image">
        <div className="pet-illustration" />
      </section>
    </section>
  </section>
);