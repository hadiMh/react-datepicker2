import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import color from 'color';

import { persianNumber, persianToEnglishNumbers } from '../utils/persian';

import { withStyles } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';
import { Button } from '@material-ui/core';

const newStyles = ({palette}) => {
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
    dayTaskHuge1: {
      backgroundColor: 'red !important',
      border: 'none !important',
      width: '4px !important',
      height: '4px !important',
    },
    dayTaskHuge2: {
      backgroundColor: 'yellow !important',
      border: 'none !important',
      width: '4px !important',
      height: '4px !important',
    },
    dayTaskHuge3: {
      backgroundColor: 'green !important',
      border: 'none !important',
      width: '4px !important',
      height: '4px !important',
    },
    dayTaskHuge3: {
      backgroundColor: 'grey !important',
      border: 'none !important',
      width: '4px !important',
      height: '4px !important',
    },
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
  state = {
    percent: 0,
  }

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
  };

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.selected !== this.props.selected ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.isCurrentMonth !== this.props.isCurrentMonth ||
      nextProps.numberOfTasks !== this.props.numberOfTasks
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
    
    const numberOfTasks = +persianToEnglishNumbers(this.props.numberOfTasks || '0');
    const maxNumberOfTasks = +persianToEnglishNumbers(this.props.maxNumberOfTasks || '1');
    const percent = (( numberOfTasks / maxNumberOfTasks ) * 100);
    this.setState({percent: percent});
    const hexPercent = (Math.round(percent) / 100).toString(16);
    const primaryColorHexAlpha = `${this.props.theme.palette.primary.main}${hexPercent === 0 ? '00' : hexPercent}`;

    return (
      <div className={className}>
        <Button onClick={this.handleClick.bind(this)} disabled={disabled} >
          {isGregorian ? day.format('D') : persianNumber(day.format('jD'))}
        </Button>
        <div className="highLightDot-container" onClick={this.handleClick.bind(this)}>
          { percent !== 0 && isCurrentMonth &&
            <span
              className="highLightDot"
              style={{
                backgroundColor: primaryColorHexAlpha,
              }}>
            </span>
          }
        </div>
      </div>
    );
  }
}

export default withTheme(withStyles(newStyles)(Day));