import * as React from 'react';
import { DialogProps, Dialog, DialogContent, DialogActions, Button, DialogContentText } from '@material-ui/core';

export interface TaskDeleteConfirmProps extends DialogProps {
  onDelete: () => any;
  close: () => any;
} 

export const TaskDeleteConfirm: React.FunctionComponent<TaskDeleteConfirmProps> = ( { close, onDelete, ...props } ): JSX.Element => (
  <Dialog {...props}>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this task?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="text" color="default" onClick={close}>
        Cancel
      </Button>
      <Button variant="text" color="primary" onClick={onDelete}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
)