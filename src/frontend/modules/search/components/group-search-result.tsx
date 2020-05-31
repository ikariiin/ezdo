import * as React from 'react';
import { Groups } from '../../../../backend/entities/groups';
import { Typography, Paper } from '@material-ui/core';
import "../scss/group-search-result.scss";

export const GroupSearchResult: React.FunctionComponent<Groups & { index: number; }> = ({ name, id, index }): JSX.Element => (
  <Paper className="group-search-result" elevation={0}>
    <span className="group-id">
      Group #{index}
    </span>
    <Typography variant="h4" className="group-name">{name}</Typography>
  </Paper>
)