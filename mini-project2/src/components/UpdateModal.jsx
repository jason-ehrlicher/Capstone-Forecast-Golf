import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../theme';

function UpdateNotificationModal({ open, onClose }) {
  // Accessing the theme for styling
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: colors.primary[500] }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: colors.grey[100],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? '#fcfcfc' : colors.primary[500],
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Typography>Update Successful</Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? '#fcfcfc' : colors.primary[600],
        }}
      >
        <Button onClick={onClose} color="secondary" sx={{ color: colors.greenAccent[500] }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateNotificationModal;
