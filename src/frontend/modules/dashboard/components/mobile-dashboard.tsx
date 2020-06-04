import * as React from 'react';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Groups } from '../../../../backend/entities/groups';
import { GroupUpdate } from './dashboard';
import { API_HOST, API_GROUPS } from '../../util/api-routes';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import "../scss/mobile-dashboard.scss";
import { Group } from './group';
import GroupIcon from '@material-ui/icons/ViewModule';
import AddIcon from '@material-ui/icons/Add';
import { GroupPlaceholder } from './group-placeholder';
import { Skeleton } from '@material-ui/lab';

export interface MobileDashboardProps extends WithSnackbarProps {}

@observer
class MobileDashboardComponent extends React.Component<MobileDashboardProps> {
  @observable groups: Array<Groups> = [];
  @observable groupUpdates: GroupUpdate = {};
  @observable activeGroup?: Groups = undefined;
  @observable private loading: boolean = false;

  private async getGroups(): Promise<void> {
    this.loading = true;
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

    this.loading = false;
    this.groups = responseJson;
    this.groups.map(group => group.id).forEach(groupId => this.groupUpdates[groupId] = 0);
    if(this.groups.length !== 0) {
      this.activeGroup = this.groups[0];
    }
  }

  public componentDidMount(): void {
    this.getGroups();
  }

  @action private refreshGroup(id: number): void {
    this.groupUpdates[id]++;
  }

  @action private setActiveGroup(id: number) {
    if(id < 0) {
      this.activeGroup = undefined;
      return;
    }
    this.activeGroup = this.groups.filter(group => group.id === id)[0];
  }

  @computed private get addGroupActions(): React.ReactNode {
    const numberGroups = 4 - this.groups.length;
    let key = -5;
    return Array(numberGroups).fill(
      <BottomNavigationAction label={"Add Group"} value={++key} icon={<AddIcon />} />
    )
  }

  public render() {
    if(!localStorage.getItem('jwtKey')) {
      return <Redirect to="/login" />;
    }

    return (
      <main className="mobile-dashboard">
        {this.loading && (
          <Skeleton variant="rect" className="loading-skeleton" animation="wave" />
        )}
        {!this.activeGroup && !this.loading && (
          <GroupPlaceholder refresh={() => this.getGroups()} className="mobile-placeholder" createMode />
        )}
        {this.activeGroup && !this.loading && (
          <Group
            refresh={() => this.getGroups()} className="mobile-group-display"
            refreshGroup={(id: number) => this.refreshGroup(id)}
            groupUpdate={this.groupUpdates[this.activeGroup.id]}
            title={this.activeGroup.name} id={this.activeGroup.id} key={this.activeGroup.id} />
        )}
        <BottomNavigation
          value={this.activeGroup?.id}
          showLabels
          onChange={(ev: any, id: number) => this.setActiveGroup(id)} className="bottom-nav">
          {this.groups.map(group => (
            <BottomNavigationAction label={group.name} value={group.id} disabled={this.loading} icon={<GroupIcon />} key={group.id} />
          ))}
          {this.addGroupActions}
        </BottomNavigation>
      </main>
    )
  }
}

export const MobileDashboard = withSnackbar(MobileDashboardComponent);