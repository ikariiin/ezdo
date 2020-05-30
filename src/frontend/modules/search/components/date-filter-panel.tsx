import * as React from 'react';
import { Paper, Typography, InputAdornment, Button } from '@material-ui/core';
import { SearchFilterProps } from './search-filters';
import "../scss/date-filter-panel.scss";
import { DatePicker } from '@material-ui/pickers';
import DateIcon from '@material-ui/icons/DateRange';

export interface DateFilterProps extends SearchFilterProps {
  close: () => any;
}

export class DateFilterPanel extends React.Component<DateFilterProps> {
  private clearDates(): void {
    this.props.onChangeMinDate(undefined);
    this.props.onChangeMaxDate(undefined);
    this.props.close();
  }
  public render() {
    return (
      <Paper className="date-filter-panel">
        {/* <Typography variant="h6">
          Date Filter
        </Typography> */}
        <DatePicker
          value={this.props.minDate}
          onChange={this.props.onChangeMinDate}
          variant="inline"
          size="small"
          className="date-input"
          inputVariant="outlined"
          maxDate={this.props.maxDate === null ? undefined : this.props.maxDate}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <DateIcon />
              </InputAdornment>
            )
          }}
          label="After" />
        <DatePicker
          value={this.props.maxDate}
          onChange={this.props.onChangeMaxDate}
          variant="inline"
          size="small"
          className="date-input"
          inputVariant="outlined"
          minDate={this.props.minDate === null ? undefined : this.props.minDate}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <DateIcon />
              </InputAdornment>
            )
          }}
          label="Before" />

        <section className="actions">
          <Button variant="text" color="default" onClick={() => this.clearDates()}>Clear</Button>
          <Button variant="text" color="primary" onClick={this.props.close}>Close</Button>
        </section>
      </Paper>
    );
  }
}