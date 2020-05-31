import * as React from 'react';
import { SearchInput } from './search-input';
import "../scss/search.scss";
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Todo } from '../../../../backend/entities/todo';
import { Typography } from '@material-ui/core';
import { API_HOST, API_TODOS, API_GROUPS } from '../../util/api-routes';
import { Task } from '../../dashboard/components/task';
import { Groups } from '../../../../backend/entities/groups';
import { GroupSearchResult } from './group-search-result';
import { SearchFilter } from './search-filters';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Redirect } from 'react-router-dom';
import { withSnackbar, WithSnackbarProps } from 'notistack';

export enum SearchCategory {
  Task = "Task",
  Label = "Label",
  Group = "Group"
}

@observer
class SearchComponent extends React.Component<WithSnackbarProps> {
  @observable private activeSearchCategory: SearchCategory = SearchCategory.Task;
  @observable private search: string = "";
  @observable private searchResult: Array<Todo|Groups> = [];
  @observable private minDateFilter?: Date|null = null;
  @observable private maxDateFilter?: Date|null = null;
  @observable private notAuthorized: boolean = false;

  @computed private get noResults(): React.ReactNode {
    if(
      this.searchResult.length !== 0
    ) return null;

    return (
      <section className="no-results">
        <div className="illustration" />
        <Typography variant="h6">
          {this.search.trim().length === 0 ? (
            "Results will appear here when you start searching"
          ) : (
            "Looks like there's no results for the search term"
          )}
        </Typography>
      </section>
    )
  }

  public componentDidMount() {
    if(!localStorage.getItem('jwtKey')) {
      this.notAuthorized = true;
    }
  }

  @action private async searchGroups(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_GROUPS}/search/${encodeURIComponent(this.search)}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ''
      }
    });

    const responseJSON = await response.json();
    if(responseJSON.failed) {
      console.error(responseJSON);
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }

    this.searchResult = responseJSON.searchResult;
  }

  @action private async startSearching(searchTerm: string): Promise<void> {
    this.search = searchTerm;
    if(searchTerm.trim().length === 0) {
      this.searchResult = [];
      return;
    };

    if(this.activeSearchCategory === SearchCategory.Group) {
      this.searchGroups();
      return;
    }

    const response = await fetch(`${API_HOST}${API_TODOS}/search/${this.activeSearchCategory}/${encodeURIComponent(searchTerm)}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("jwtKey") || ''
      }
    });

    const responseJSON = await response.json();
    if(responseJSON.failed) {
      console.error(responseJSON);
      this.props.enqueueSnackbar(responseJSON.reason, {
        variant: "error"
      });
      return;
    }

    this.searchResult = responseJSON.searchResult;
  }

  @computed private get renderResults(): React.ReactNode {
    if(this.activeSearchCategory !== SearchCategory.Group) {
      const highlight: any = {};
      if(this.activeSearchCategory === SearchCategory.Task) { highlight.taskHighlight = this.search }
      if(this.activeSearchCategory === SearchCategory.Label) { highlight.labelHighlight = this.search }
      //@ts-ignore
      return this.searchResult.filter((task: Todo) => {
        if(this.minDateFilter) {
          return new Date(task.dueDate) >= this.minDateFilter;
        }
        return true;
      //@ts-ignore
      }).filter((task: Todo) => {
        if(this.maxDateFilter) {
          return new Date(task.dueDate) <= this.maxDateFilter;
        }
        return true;
      //@ts-ignore
      }).map((task: Todo) => (
        <Task
          {...task}
          {...highlight}
          refresh={() => this.startSearching(this.search)}
          refreshGroup={() => this.startSearching(this.search)} />
      ));
    }

    //@ts-ignore
    return this.searchResult.map((group: Groups) => (
      <GroupSearchResult {...group} />
    ));
  }

  public render() {
    return (
      <section className="search">
        {this.notAuthorized && <Redirect to="/login" />}
        <section className="search-input-container">
          <SearchInput
            searchCategory={this.activeSearchCategory}
            searchTerm={this.search}
            searchTermOnChange={ev => this.startSearching(ev.target.value)}
            onCategoryChange={(category: SearchCategory) => {
              this.activeSearchCategory = category;
              this.searchResult = [];
              this.startSearching(this.search);
              return true;
            }} />
          {this.searchResult.length !== 0 && (
          <SearchFilter
            minDate={this.minDateFilter}
            maxDate={this.maxDateFilter}
            activeCategory={this.activeSearchCategory}
            onChangeMinDate={(date: MaterialUiPickersDate|null|undefined) => this.minDateFilter = date?.toDate()}
            onChangeMaxDate={(date: MaterialUiPickersDate|null|undefined) => this.maxDateFilter = date?.toDate()} />
          )}
        </section>
        {this.noResults}
        <section className="filter-and-results">
          <section className="results">
            {this.renderResults}
          </section>
        </section>
      </section>
    );
  }
}

export const Search = withSnackbar(SearchComponent);