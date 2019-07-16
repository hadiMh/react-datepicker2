import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-jalaali';
import { ChevronRight, ChevronLeft } from 'mdi-material-ui';

import { persianNumber, persianToEnglishNumbers} from '../utils/persian';

import { Box, IconButton, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import CalendarYearPicker from './CalendarYearPicker';

const newStyles = theme => ({
  heading: {
    marginBottom: '20px',
  },
  previousMonth: {
    position: 'absolute',
    left: '25px',
    top: '11px',
  },
  nextMonth: {
    position: 'absolute',
    right: '25px',
    top: '11px',
  },
})

class Heading extends Component {
  currentYear = persianToEnglishNumbers(moment().format("jYYYY"));

  static propTypes = {
    month: PropTypes.object.isRequired,
    isGregorian: PropTypes.bool,
    showYearInHeaderOnlyOnOtherYears: PropTypes.bool,
    setMonth: PropTypes.func,
    setCalendarMode: PropTypes.func,
    headerMode: PropTypes.string,
  };

  static contextTypes = {
    styles: PropTypes.object,
    nextMonth: PropTypes.func.isRequired,
    prevMonth: PropTypes.func.isRequired,
    setCalendarMode: PropTypes.func.isRequired
  };

  handleMonthClick(event) {
    event.stopPropagation();
    this.props.setMode('yearSelector');
  }

  /* Show the year only if we are not in the current year */
  renderHeaderMonthYear = () => {
    const {isGregorian, month, showYearInHeaderOnlyOnOtherYears} = this.props;
    const jalaliFormat = isGregorian ? '' : 'j';
    const isInCurrentYearInCalender = persianNumber(month.format(`${jalaliFormat}YYYY`)) === moment().format(`${jalaliFormat}YYYY`) ? true : false;
    if(showYearInHeaderOnlyOnOtherYears) {
      if(isInCurrentYearInCalender) {
        return isGregorian ? month.locale('en').format('MMMM') : persianNumber(month.format(`${jalaliFormat}MMMM`))
      }
      return isGregorian ? month.locale('en').format('MMMM YYYY')  : persianNumber(month.format(`${jalaliFormat}MMMM ${jalaliFormat}YYYY`));
    }
  }

  renderYearPicker = () => {
    moment.loadPersian({usePersianDigits: false, dialect: 'persian-modern'});
    const yearPickerComponent = (
      <CalendarYearPicker 
        selectedYear={persianToEnglishNumbers(this.props.month.format("jYYYY"))}
        selectedMonth={persianToEnglishNumbers(this.props.month.format("jMM"))}
        currentYear={this.currentYear}
        setMonth={this.props.setMonth}
        setCalendarMode={this.props.setCalendarMode}
        setMode={this.props.setMode}
      />
    )
    moment.loadPersian({usePersianDigits: true, dialect: 'persian-modern'});
    return yearPickerComponent;
  }

  render() {
    const { nextMonth, prevMonth } = this.context;
    const { month, styles, isGregorian, classes } = this.props;

    const nextMonthText = isGregorian ? 'next month' : 'ماه بعد';
    const previousMonthText = isGregorian ? 'previous month' : 'ماه قبل';

    return (
      <div className={this.props.classes.heading}>
        <Box 
          className={styles.title}
          onMouseEnter={this.handleMonthClick.bind(this)}
          border={0}
          color="common.black"
          top={0}
        >
          { 
            this.props.headerMode === 'days' &&
            this.renderHeaderMonthYear()
          }
          {
            this.props.headerMode === 'yearSelector' &&
            this.renderYearPicker()
          }
        </Box>
        <Tooltip title={isGregorian ? nextMonthText : previousMonthText} placement="top">
          <IconButton
            onClick={isGregorian ? nextMonth : prevMonth}
            className={classes.previousMonth}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </Tooltip>
        <Tooltip title={isGregorian ? previousMonthText : nextMonthText} placement="top">
          <IconButton
            onClick={isGregorian ? prevMonth : nextMonth}
            className={classes.nextMonth}
            size="small"
          >
            <ChevronLeft/>
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(newStyles)(Heading);