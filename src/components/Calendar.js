import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import moment from 'moment-jalaali';

import { persianNumber } from '../utils/persian';
import RangeList from '../utils/RangesList';
import { getDaysOfMonth, checkToday } from '../utils/moment-helper';

import DaysViewHeading from './DaysViewHeading';
import DaysOfWeek from './DaysOfWeek';
import MonthSelector from './MonthSelector';
import Day from './Day';

import { defaultStyles } from './DefaultStyles';
import ShowDayEvents from './ShowDayEvents';

export class Calendar extends Component {
  static propTypes = {
    min: PropTypes.object,
    max: PropTypes.object,
    value: PropTypes.object,
    styles: PropTypes.object,
    selectedDay: PropTypes.object,
    defaultMonth: PropTypes.object,
    containerProps: PropTypes.object,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onClickOutside: PropTypes.func,
    isGregorian: PropTypes.bool,
    activateGoToTodayButton: PropTypes.bool,
    calendarClass: PropTypes.string,
    arrayOfRepetitiveHolidays: PropTypes.array,
  };

  static childContextTypes = {
    nextMonth: PropTypes.func.isRequired,
    prevMonth: PropTypes.func.isRequired,
    setCalendarMode: PropTypes.func.isRequired,
    setMonth: PropTypes.func.isRequired,
    setType: PropTypes.func.isRequired
  };

  static defaultProps = {
    styles: defaultStyles,
    containerProps: {},
    isGregorian: true
  };

  state = {
    month: this.props.defaultMonth || this.props.selectedDay || moment(this.props.min),
    selectedDay: this.props.selectedDay || this.props.value || null,
    mode: 'days',
    isGregorian: this.props.isGregorian,
    ranges: new RangeList(this.props.ranges)
  };

  getChildContext() {
    return {
      nextMonth: this.nextMonth.bind(this),
      prevMonth: this.prevMonth.bind(this),
      setCalendarMode: this.setMode.bind(this),
      setMonth: this.setMonth.bind(this),
      setType: this.setMonth.bind(this)
    };
  }

  componentWillReceiveProps({ selectedDay, defaultMonth, min, isGregorian }) {
    if (typeof isGregorian !== 'undefined' && isGregorian !== this.state.isGregorian) {
      this.setState({ isGregorian });
    }

    if (this.props.selectedDay !== selectedDay) {
      this.selectDay(selectedDay);
    } else if (
      defaultMonth &&
      this.props.defaultMonth !== defaultMonth &&
      this.state.month === this.props.defaultMonth
    ) {
      this.setMonth(defaultMonth);
    } else if (min && this.props.min !== min && this.state.month.isSame(this.props.min)) {
      this.setMonth(min.clone());
    }
  }

  componentDidMount() {
    const { isGregorian } = this.state;
    const monthFormat = isGregorian ? 'Month' : 'jMonth';

    this.setState({
      month: this.state.month.clone().add(0, monthFormat)
    });
  }

  setMode = mode => {
    this.setState({ mode });
  };

  setMonth = month => {
    this.setState({ month });
  };

  setType = type => {
    this.setState({ type });
  };

  nextMonth = () => {
    const { isGregorian } = this.state;
    const monthFormat = isGregorian ? 'Month' : 'jMonth';

    this.setState({
      month: this.state.month.clone().add(1, monthFormat)
    });
  };

  prevMonth = () => {
    const { isGregorian } = this.state;
    const monthFormat = isGregorian ? 'Month' : 'jMonth';

    this.setState({
      month: this.state.month.clone().subtract(1, monthFormat)
    });
  };

  selectDay = selectedDay => {
    const { month, isGregorian } = this.state;
    const yearMonthFormat = isGregorian ? 'YYYYMM' : 'jYYYYjMM';

    // Because there's no `m1.isSame(m2, 'jMonth')`
    if (selectedDay.format(yearMonthFormat) !== month.format(yearMonthFormat)) {
      this.setState({ month: selectedDay });
    }

    this.setState({ selectedDay });
  };

  handleClickOnDay = selectedDay => {
    const { onSelect, onChange } = this.props;
    this.selectDay(selectedDay);
    if (onSelect) {
      onSelect(selectedDay);
    }
    if (onChange) onChange(selectedDay);
  };

  handleClickOutside = event => {
    if (this.props.onClickOutside) {
      this.props.onClickOutside(event);
    }
  };

  days = null;

  lastRenderedMonth = null;

  renderMonthSelector = () => {
    const { month, isGregorian } = this.state;
    const { styles } = this.props;
    return <MonthSelector styles={styles} isGregorian={isGregorian} selectedMonth={month} />;
  };

  renderDays = () => {
    const { month, selectedDay, isGregorian, mode } = this.state;
    const { children, min, max, styles, arrayOfRepetitiveHolidays } = this.props;

    let days;

    if (this.lastRenderedMonth === month) {
      days = this.days;
    } else {
      days = getDaysOfMonth(month, isGregorian);
      this.days = days;
      this.lastRenderedMonth = month;
    }

    const monthFormat = isGregorian ? 'MM' : 'jMM';
    const dateFormat = isGregorian ? 'YYYYMMDD' : 'jYYYYjMMjDD';
    return (
      <div className={this.props.calendarClass}>
        {children}
        <DaysViewHeading
          isGregorian={isGregorian}
          styles={styles}
          month={month}
          showYearInHeaderOnlyOnOtherYears={true}
          setMonth={this.setMonth}
          setCalendarMode={this.setCalendarMode}
          setMode={this.setMode}
          headerMode={this.state.mode}
        />
        <DaysOfWeek 
          styles={styles}
          isGregorian={isGregorian}
        />
        <div className={styles.dayPickerContainer}>
          {days.map(day => {
            const isCurrentMonth = day.format(monthFormat) === month.format(monthFormat);

            const jalali = isGregorian ? '' : 'j';

            /* Boolean to indicate if the day is before today to make it grey */
            const isBeforeTodayInCurrentMonth =
              (
                persianNumber(day.format(`${jalali}YYYY`)) < moment().format(`${jalali}YYYY`)
                || (
                  persianNumber(day.format(`${jalali}YYYY`)) === moment().format(`${jalali}YYYY`)
                  && persianNumber(day.format(`${jalali}MM`)) < moment().format(`${jalali}MM`)
                )
                || (
                  persianNumber(day.format(`${jalali}YYYY`)) === moment().format(`${jalali}YYYY`)
                  && persianNumber(day.format(`${jalali}MM`)) === moment().format(`${jalali}MM`)
                  && persianNumber(day.format(`${jalali}DD`)) < moment().format(`${jalali}DD`)
                )
              ) ? true : false;

            const selected = selectedDay ? selectedDay.isSame(day, 'day') : false;
            const key = day.format(dateFormat);
            const isToday = checkToday(day, moment());

            // disabling by old min-max props
            const disabled = (min ? day.isBefore(min) : false) || (max ? day.isAfter(max) : false);

            // new method for disabling and highlighting the ranges of days
            const dayState = this.state.ranges.getDayState(day);
            
            return (
              <Day
                isGregorian={isGregorian}
                key={key}
                onClick={this.handleClickOnDay}
                day={day}
                isToday={isToday}
                colors={dayState.colors}
                disabled={disabled || dayState.disabled} // disabled by old method or new range method
                selected={selected}
                isCurrentMonth={isCurrentMonth}
                styles={styles}
                isBeforeTodayInCurrentMonth={isBeforeTodayInCurrentMonth}
                arrayOfRepetitiveHolidays={arrayOfRepetitiveHolidays}
                numberOfTasks={day.format("DD")}
                maxNumberOfTasks={'31'}
              />
            );
          })}
        </div>
        {/* <ShowDayEvents/> */}
      </div>
    );
  };

  render() {
    const {
      styles,
      className,
      activateGoToTodayButton
    } = this.props;
    const { isGregorian } = this.state;

    const jalaaliClassName = isGregorian ? '' : 'jalaali ';

    return (
      <div className={`${styles.calendarContainer} ${jalaaliClassName}${className} `}>
        { this.renderDays() }
        { !!activateGoToTodayButton && 
          <button className="selectToday" onClick={() => this.handleClickOnDay(moment())}>
            {isGregorian ? 'today' : 'امروز'}
          </button>
        }
        
      </div>
    );
  }
}

export default onClickOutside(Calendar);
