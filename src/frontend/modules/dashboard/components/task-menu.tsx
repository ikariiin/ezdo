import * as React from 'react';
import { Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import MoveIcon from '@material-ui/icons/PanToolOutlined';
import DeleteIcon from "@material-ui/icons/DeleteOutline";

export interface TaskMenuProps {
  anchorEl: Element|null;
  open: boolean;
  onClose: () => any;
  onDelete: () => any;
  onEdit: () => any;
  onMove: () => any;
}

export const TaskMenu: React.FunctionComponent<TaskMenuProps> = (props): JSX.Element => (
  <Menu anchorEl={props.anchorEl} open={props.open} onClose={props.onClose}>
    <MenuItem onClick={props.onEdit}>
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
      Edit
    </MenuItem>
    <MenuItem onClick={props.onMove}>
      <ListItemIcon>
        <MoveIcon />
      </ListItemIcon>
      Move Groups
    </MenuItem>
    <MenuItem onClick={props.onDelete}>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      Delete
    </MenuItem>
  </Menu>
)