import * as React from 'react';
import { Dialog, DialogProps, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

export interface ArchiveClearConfirmProps extends DialogProps {
  close: () => any;
  confirm: () => any;
}

export const ArchiveClearConfirm: React.FunctionComponent<ArchiveClearConfirmProps> = ({ open, onClose, close, confirm }): JSX.Element => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to clear the archive? This will delete all the archived tasks.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={close} variant="text">
        Cancel
      </Button>
      <Button color="secondary" onClick={confirm} variant="text">
        Yup! Clear it!
      </Button>
    </DialogActions>
  </Dialog>
)