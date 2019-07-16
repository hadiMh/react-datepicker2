import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment-jalaali';

import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, FormControl, Select } from '@material-ui/core';

import { persianNumber, persianToEnglishNumbers} from '../utils/persian';

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '30%',
    marginBottom: '-20px',
    position: 'relative',
    bottom: '3px',
  },
}));

export default function CalendarYearPicker (props) {
  const classes = useStyles();
  const currentYear = parseInt(persianToEnglishNumbers(moment().format('jYYYY')));
  const [pickedYear, setPickedYear] = useState(parseInt(props.selectedYear));
  const [open, setOpen] = useState(false);

  function handleChange(event) {
    event.stopPropagation();
    setPickedYear(event.target.value);
    handleClick(event.target.value);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  const yearPickerExit = () => {
    props.setMode('days');
  }

  const handleClick = (year) => {
    const { isGregorian, selectedMonth } = props;
    const monthYearFormat = isGregorian ? 'M-YYYY' : 'jM-jYYYY';
    props.setMonth(moment(`${year}-${selectedMonth}-12`, 'jYYYY-jMM'));
    yearPickerExit();
  }

  return (
    <form autoComplete="off">
      <FormControl className={classes.formControl}>
        <Select
          disableUnderline
          open={open}
          onMouseLeave={yearPickerExit}
          onClose={handleClose}
          onOpen={handleOpen}
          value={pickedYear}
          onChange={handleChange}
        >
          { 
            _.range(currentYear - 50, currentYear + 50).map( num => {
              return <MenuItem key={num} value={num}>{persianNumber(num)}</MenuItem>
            })
          }
        </Select>
      </FormControl>
    </form>
  );
}