import * as React from 'react';
import "../scss/dashboard.scss";
import { Group } from './group';
import { API_HOST, API_GROUPS } from '../../util/api-routes';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Groups } from '../../../../backend/entities/groups';
import { GroupPlaceholder } from './group-placeholder';
import { Redirect } from 'react-router-dom';
import { WithSnackbarProps, withSnackbar } from 'notistack';

export interface GroupUpdate {
  [key: number]: number
}

@observer
class DashboardComponent extends React.Component<WithSnackbarProps> {
  @observable groups: Array<Groups> = [];
  @observable groupUpdates: GroupUpdate = {};
  @observable notAuthrorized: boolean = false;

  private async getGroups(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_GROUPS}`, {
      headers: {
        Authorization: localStorage.getItem('jwtKey') || ''
      },
      method: "GET"
    });
    const responseJson = await response.json();

    if(responseJson.failed) {
      // We messed up.
      this.props.enqueueSnackbar(responseJson.reason, {
        variant: "error"
      });
      console.error(responseJson);
      return;
    }

    this.groups = responseJson;
    this.groups.map(group => group.id).forEach(groupId => this.groupUpdates[groupId] = 0);
  }

  private renderBlankGroups(): Array<React.ReactNode> {
    const numberGroups = 4 - this.groups.length;
    let key = -5;
    return Array(numberGroups).fill(
      <GroupPlaceholder refresh={() => this.getGroups()} />
    ).map(placeholderComponent => React.cloneElement(placeholderComponent, { key: ++key }));
  }

  public componentDidMount(): void {
    this.getGroups();
    if(!localStorage.getItem('jwtKey')) {
      this.notAuthrorized = true;
    }
  }

  @action private refreshGroup(id: number): void {
    this.groupUpdates[id]++;
  }

  public render() {
    return (
      <main className="dashboard">
        {this.notAuthrorized && <Redirect to="/login" />}
        {this.groups.map(group => (
          <Group
            refresh={() => this.getGroups()}
            refreshGroup={(id: number) => this.refreshGroup(id)}
            groupUpdate={this.groupUpdates[group.id]}
            title={group.name} id={group.id} key={group.id} />
        ))}
        {this.renderBlankGroups()}
      </main>
    );
  }
}

export const Dashboard = withSnackbar(DashboardComponent);
