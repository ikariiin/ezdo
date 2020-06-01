import * as React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';

export interface GroupMenuProps {
  anchorEl: Element|null;
  open: boolean;
  onDelete: () => any;
  onClose: () => any;
}

export const GroupMenu: React.FunctionComponent<GroupMenuProps> = ({ anchorEl, open, onDelete, onClose }): JSX.Element => (
  <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
    <MenuItem onClick={onDelete}>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Delete Group" />
    </MenuItem>
  </Menu>
)