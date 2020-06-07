import * as React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, DialogProps } from '@material-ui/core';

export interface ImageDeleteConfirmProps extends DialogProps {
  close: () => any;
  confirmDelete: () => any;
}

export const ImageDeleteConfirm: React.FunctionComponent<ImageDeleteConfirmProps> = ({ open, onClose, close, confirmDelete }): JSX.Element => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to remove this image?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="text" color="primary" onClick={close}>
        Cancel
      </Button>
      <Button variant="text" color="secondary" onClick={confirmDelete}>
        Remove
      </Button>
    </DialogActions>
  </Dialog>
)