import * as React from 'react';
import { Dialog, DialogProps, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

export interface GroupDeleteConfirmProps extends DialogProps {
  close: () => any;
  onDelete: () => any;
}

export const GroupDeleteConfirm: React.FunctionComponent<GroupDeleteConfirmProps> = ({ ...props }): JSX.Element => (
  <Dialog open={props.open} onClose={props.onClose}>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this group? Deleting would move all the tasks in this
        group to the <Link to="/archive">Archive</Link>.
      </DialogContentText>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={props.close}>
          Cancel
        </Button>
        <Button variant="text" color="primary" onClick={props.onDelete}>
          Delete
        </Button>
      </DialogActions>
    </DialogContent>
  </Dialog>
)