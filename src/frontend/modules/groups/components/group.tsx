import * as React from 'react';
import { RoutesProps } from '../../root/components/routes';
import { useParams, Redirect } from 'react-router-dom';
import { Tasks } from './tasks';
import "../scss/group.scss";

export const Group: React.FunctionComponent<RoutesProps> = (props: RoutesProps): JSX.Element => {
  const { groupId, groupName } = useParams();
  if(!localStorage.getItem("jwtKey")) {
    return <Redirect to="/login" />
  }
  props.changeTitle(`Group: ${groupName}`);

  return (
    <main className="group-page">
      <Tasks {...props} groupId={Number(groupId)} />
    </main>
  );
};