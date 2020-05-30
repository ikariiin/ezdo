import * as React from 'react';
import { Paper, IconButton, Tooltip } from '@material-ui/core';
// import SettingsIcon from '@material-ui/icons/Settings';
// import LabelIcon from '@material-ui/icons/Label';
import DateIcon from '@material-ui/icons/DateRange';
import FilterIcon from '@material-ui/icons/FilterListRounded';
import "../scss/search-filters.scss";
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DateFilterPanel } from './date-filter-panel';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export interface SearchFilterProps {
  minDate: Date|null|undefined;
  maxDate: Date|null|undefined;
  onChangeMinDate: (date: MaterialUiPickersDate|null|undefined) => any;
  onChangeMaxDate: (date: MaterialUiPickersDate|null|undefined) => any;
} 

@observer
export class SearchFilter extends React.Component<SearchFilterProps> {
  @observable private openDatePanel: boolean = false;

  public render() {
    return (
      <section className={`search-filters-container ${this.openDatePanel && "with-date-panel"}`}>
        <Paper elevation={6} className="search-filters">
          <header className="header-icon">
            <FilterIcon />
          </header>
          <Tooltip title="Filter by date(s)" placement="right">
            <IconButton
              onClick={() => this.openDatePanel = !this.openDatePanel}
              color={(
                this.openDatePanel
                || this.props.maxDate
                || this.props.minDate
              ) ? "primary" : "default"}>
              <DateIcon />
            </IconButton>
          </Tooltip>
        </Paper>
        {this.openDatePanel && <DateFilterPanel {...this.props} close={() => this.openDatePanel = false} />}
      </section>
    )
  }
}