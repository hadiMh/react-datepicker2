import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

// Day of week names for use in date-picker heading
const dayOfWeekNamesJalaali = ['شنبه', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه'];
const dayOfWeekNamesGregorian = ['Sa', 'Fr', 'Th', 'We', 'Tu', 'Mo', 'Su'];

class DaysOfWeek extends Component {
  static propTypes = {
    styles: PropTypes.object,
    isGregorian: PropTypes.bool
  };

  render() {
    const { styles, isGregorian } = this.props;

    const dayOfWeekNames = isGregorian ? dayOfWeekNamesGregorian : dayOfWeekNamesJalaali;

    return (
      <div className={styles.daysOfWeek}>
        {
          dayOfWeekNames.map((name, key) => (
            <Box
              clone
              color="common.black"
              key={key}
            >
              <div>{name}</div>
            </Box>
          ))
        }
      </div>
    );
  }
}

export default (DaysOfWeek);