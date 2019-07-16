import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { persianNumber, persianToEnglishNumbers } from '../utils/persian';

import { withStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';

const newStyles = (theme) => {
  const palette = theme.palette;
  console.log("myTheme", theme);
  return ({
    today: {
      '& button': {
        backgroundColor: `${palette.primary.light} !important`,
        color: palette.common.white
      }
    },
    daySelected: {
      '& button': {
        backgroundColor: `${palette.primary.main} !important`,
        color: palette.common.white
      },
    },
    holiday: {
      '& button': {
        color: `${palette.error.main} !important`,
        '&:focus': {
          '& span':{
            color: `${palette.common.white} !important`,
          },
        },
      },
    },
    dayButton: {
      '& button': {
        minWidth: '40px ',
        width: '40px',
        height: '40px',
        transition: 'none',
        '&:hover': {
          background: `${palette.primary.light} !important`,
          opacity: '0.5',
          color: palette.common.white,
       },
      },
    },
    dayTaskDot: props => {
      const {isCurrentMonth, isBeforeTodayInCurrentMonth} = props;
      const numberOfTasks = Number(persianToEnglishNumbers(props.numberOfTasks));
      const maxNumberOfTasks = Number(persianToEnglishNumbers(props.maxNumberOfTasks));
      const quantumPercent = (Math.ceil(numberOfTasks / maxNumberOfTasks * 3)) / 3 * 100;
      // const percent = Math.ceil(numberOfTasks / maxNumberOfTasks * 100);
      const hexPercentage = Math.ceil(quantumPercent) < 100 ? (Math.ceil(quantumPercent)).toString(16) : 'FF';
      const commonStyle = {
        backgroundColor: `${palette.primary.main}${hexPercentage} !important`,
        border: 'none !important',
        width: '4px !important',
        height: '4px !important',
      }
      return (isBeforeTodayInCurrentMonth || !isCurrentMonth)
      ? ({
        ...commonStyle,
        opacity: '0.2',
      })
      : ({
        ...commonStyle
      })
    }
  })
};

const styles = {
  wrapper: {},
  button: {
    outline: 'none',
    cursor: 'pointer'
  }
};

class Day extends Component {
  static propTypes = {
    day: PropTypes.object.isRequired,
    isCurrentMonth: PropTypes.bool,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    isGregorian: PropTypes.bool,
    isHoliday: PropTypes.bool,
    onClick: PropTypes.func,
    isToday: PropTypes.bool,
    styles: PropTypes.object,
    isBeforeTodayInCurrentMonth: PropTypes.bool,
    arrayOfRepetitiveHolidays: PropTypes.array,
    maxNumberOfTasks: PropTypes.string,
    numberOfTasks: PropTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.selected !== this.props.selected ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.isCurrentMonth !== this.props.isCurrentMonth
    );
  }

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    const { onClick, day } = this.props;

    if (onClick) {
      onClick(day);
    }
  }

  render() {
    const {
      day,
      disabled,
      selected,
      isCurrentMonth,
      onClick,
      styles,
      isGregorian,
      isToday,
      colors,
      classes,
      isBeforeTodayInCurrentMonth,
      isHoliday,
      arrayOfRepetitiveHolidays,
      ...rest
    } = this.props;

    console.log("sese", (parseInt(this.props.numberOfTasks) * 10).toString(16));

    const className = classnames(
      styles.dayWrapper,
      this.props.classes.dayButton,
      {
        [this.props.classes.daySelected]: selected,
        [styles.currentMonth]: isCurrentMonth && !isBeforeTodayInCurrentMonth,
        [this.props.classes.today]: isToday,
        [this.props.classes.holiday]: arrayOfRepetitiveHolidays.includes(day.format("ddd")) || isHoliday || false,
      },
    );

    return (
      <div className={className}>
        <Button onClick={this.handleClick.bind(this)} disabled={disabled} /*className={isToday ? classes.daySelected : ''}*/ >
          {isGregorian ? day.format('D') : persianNumber(day.format('jD'))}
        </Button>
        <div className="highLightDot-container" onClick={this.handleClick.bind(this)}>
          {
            <span className={`highLightDot ${classes.dayTaskDot}`}></span>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(newStyles)(Day);