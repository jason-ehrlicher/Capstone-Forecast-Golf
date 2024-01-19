import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme'; // Adjust the import path as needed

const InputRounds = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [roundsPlayed, setRoundsPlayed] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit = () => {
    console.log('Submitting:', roundsPlayed, selectedDate);
    // Implement the submit logic here
  };

  return (
    <>
    <Box mt="30px" sx={{backgroundColor: colors.primary[400]}}>
    <Box 
      style={{ padding: '20px', color: colors.grey[100] }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" style={{ marginBottom: '10px', textAlign: 'center' }}>
        Rounds Played
      </Typography>
      <TextField
        label="Rounds"
        variant="outlined"
        value={roundsPlayed}
        onChange={(e) => setRoundsPlayed(e.target.value)}
        fullWidth
        style={{ marginBottom: '20px', maxWidth: '300px' }}
      />
      <TextField
        label="Date"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        style={{ marginBottom: '20px', maxWidth: '300px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ backgroundColor: colors.greenAccent[500], maxWidth: '300px' }}
      >
        Submit
      </Button>
    </Box>
    </Box>
    </>
  );
};

export default InputRounds;
