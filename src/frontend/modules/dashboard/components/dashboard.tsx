import * as React from 'react';
import "../scss/dashboard.scss";
import { Group } from './group';
import { API_HOST, API_GROUPS } from '../../util/api-routes';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Groups } from '../../../../backend/entities/groups';
import { GroupPlaceholder } from './group-placeholder';
import { Redirect } from 'react-router-dom';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { isMobile } from '../../util/is-mobile';
import { MobileDashboard } from './mobile-dashboard';
import { RoutesProps } from '../../root/components/routes';
import { Introduction } from '../../introduction/components/introduction';
import { Skeleton } from '@material-ui/lab';

export interface GroupUpdate {
  [key: number]: number
}

export interface DashboardProps extends WithSnackbarProps, RoutesProps {
}

@observer
class DashboardComponent extends React.Component<DashboardProps> {
  @observable groups: Array<Groups> = [];
  @observable groupUpdates: GroupUpdate = {};
  @observable notAuthrorized: boolean = false;
  @observable loading: boolean = false;
  private snackbarKey?: React.ReactText;

  private async getGroups(): Promise<void> {
    this.loading = true;
    const response = await fetch(`${API_HOST}${API_GROUPS}`, {
      headers: {
        Authorization: localStorage.getItem('jwtKey') || ''
      },
      method: "GET"
    });
    const responseJson = await response.json();
    this.loading = false;
    this.props.closeSnackbar(this.snackbarKey);
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

  private renderBlankGroups(): React.ReactNode {
    const numberGroups = 4 - this.groups.length;
    let key = -5;
    if(numberGroups > 0 && !this.loading) {
      return <GroupPlaceholder refresh={() => { this.getGroups(); this.props.refreshDrawerGroups(); }} />;
    }
    return null;
  }

  public componentDidMount(): void {
    this.getGroups();
    if(!localStorage.getItem('jwtKey')) {
      this.notAuthrorized = true;
    }

    this.props.changeTitle("Dashboard");
  }

  @action private refreshGroup(id: number): void {
    this.groupUpdates[id]++;
  }

  @computed get loadingRender(): React.ReactNode {
    if(!this.loading) return null;

    if(this.groups.length !== 0) {
      this.snackbarKey = this.props.enqueueSnackbar("Refreshing...", {
        variant: "default",
        autoHideDuration: 2000
      });
      return null;
    }

    return (
      <>
        <Skeleton variant="rect" className="skeleton" animation="wave" />
        <Skeleton variant="rect" className="skeleton" animation="wave" />
        <Skeleton variant="rect" className="skeleton" animation="wave" />
        <Skeleton variant="rect" className="skeleton" animation="wave" />
      </>
    );
  }

  public render() {
    if(isMobile()){
      return <MobileDashboard />;
    }
    return (
      <main className="dashboard">
        <Introduction />
        {this.notAuthrorized && <Redirect to="/login" />}
        {this.loadingRender}
        {this.groups.map(group => (
          <Group
            refresh={() => { this.getGroups(); this.props.refreshDrawerGroups(); }}
            refreshGroup={(id: number) => { this.refreshGroup(id); this.props.refreshDrawerGroups(); }}
            groupUpdate={this.groupUpdates[group.id]}
            title={group.name} id={group.id} key={group.id} />
        ))}
        {this.renderBlankGroups()}
      </main>
    );
  }
}

export const Dashboard = withSnackbar(DashboardComponent);
