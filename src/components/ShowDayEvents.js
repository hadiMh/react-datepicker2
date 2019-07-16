import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => {
  return ({
    eventsShowBox: {
      color: theme.palette.text.secondary,
      fontSize: '0.8rem'
    }
  })
})

const ShowDayEvents = () => {
  const classes = useStyles();

  return (
    <Box
      color="text.secondary"
      p={1}
      textAlign="left"
    >
      <Typography
        variant="caption"
      >
        {['شهادت امام رضا', 'روز جهانی فلسفه','هفته کتاب و کتابخوانی در جهان اسلام'].join(' / ')}
      </Typography>
    </Box>
  )
}

export default ShowDayEvents;