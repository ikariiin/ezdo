import * as React from 'react';
import "../scss/dashboard.scss";
import { Group } from './group';
import { API_HOST, API_GROUPS } from '../../util/api-routes';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Groups } from '../../../../backend/entities/groups';
import { GroupPlaceholder } from './group-placeholder';

@observer
export class Dashboard extends React.Component<{}> {
  @observable groups: Array<Groups> = [];

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
      // TODO show error snackbar
      console.error(responseJson);
    }

    this.groups = responseJson;
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
  }

  public render() {
    return (
      <main className="dashboard">
        {this.groups.map(group => (
          <Group title={group.name} id={group.id} key={group.id} />
        ))}
        {this.renderBlankGroups()}
      </main>
    );
  }
}