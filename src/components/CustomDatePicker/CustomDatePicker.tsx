import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Popover, Box, Stack, Typography, IconButton, Divider, useTheme, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useData } from '../../context/dataContext';

dayjs.extend(isBetween);

function CustomPickersDay(props: PickersDayProps<Dayjs>) {
  const { dateRange } = useData();
  const theme = useTheme();
  const { day, outsideCurrentMonth, ...other } = props;

  const { startDate, endDate } = dateRange;
  const start = startDate ? dayjs(startDate) : null;
  const end = endDate ? dayjs(endDate) : null;

  const isRange =
    !outsideCurrentMonth &&
    start &&
    end &&
    day.isAfter(start, 'day') &&
    day.isBefore(end, 'day');

  const isStart = !outsideCurrentMonth && start && day.isSame(start, 'day');
  const isEnd = !outsideCurrentMonth && end && day.isSame(end, 'day');

  // If it's the same day selected as both start and end
  const isSingleDayRange = isStart && isEnd;

  let styles = {};

  if (isSingleDayRange) {
    styles = {
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    };
  } else if (isStart) {
    styles = {
      borderRadius: '50% 0 0 50%',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    };
  } else if (isEnd) {
    styles = {
      borderRadius: '0 50% 50% 0',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    };
  } else if (isRange) {
    styles = {
      borderRadius: 0,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      }
    };
  }

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        ...styles,
      }}
    />
  );
}

export default function CustomDatePicker() {
  const { dateRange, setDateRange } = useData();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    // Initialize current view to start date month or current month
    setCurrentMonth(dateRange.startDate ? dayjs(dateRange.startDate) : dayjs());
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Unified Date Selection Logic
  const handleDateClick = (newValue: Dayjs | null) => {
    if (!newValue) return;
    const newDate = newValue.toDate();

    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      // Start fresh
      setDateRange({ startDate: newDate, endDate: null });
    } else if (dateRange.startDate && !dateRange.endDate) {
      // We have a start date, setting end date
      if (newValue.isBefore(dayjs(dateRange.startDate), 'day')) {
        // Clicked before start -> make it new start
        setDateRange({ startDate: newDate, endDate: null });
      } else {
        // Clicked after start -> make it end
        setDateRange({ ...dateRange, endDate: newDate });
      }
    }
  };

  const handleClear = () => {
    setDateRange({ startDate: null, endDate: null });
    handleClose();
  };

  // const handleNextMonth = () => {
  //   setCurrentMonth(prev => prev.add(1, 'month'));
  // };

  // const handlePrevMonth = () => {
  //   setCurrentMonth(prev => prev.subtract(1, 'month'));
  // };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;
  const CALENDAR_WIDTH = 320;

  const buttonLabel = dateRange.startDate && dateRange.endDate
    ? `${dayjs(dateRange.startDate).format('MMM DD')} - ${dayjs(dateRange.endDate).format('MMM DD, YYYY')}`
    : dateRange.startDate
      ? `${dayjs(dateRange.startDate).format('MMM DD, YYYY')} - Select End`
      : 'Select Date Range';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
        onClick={handleClick}
        sx={{ minWidth: 200, justifyContent: 'flex-start', color: 'text.primary', borderColor: 'divider' }}
      >
        {buttonLabel}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { p: 2, width: 'auto', maxWidth: 'none' }
        }}
      >
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" fontWeight="bold">Select Date Range</Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <Box
              sx={{
                width: CALENDAR_WIDTH,
                display: 'flex',
                flexDirection: 'column',
                // Control Nav Buttons via CSS: Hide Next button and move Prev button to left
                '& .MuiPickersArrowSwitcher-root button[title="Next month"]': { display: 'none' },
                '& .MuiPickersCalendarHeader-root': {
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                '& .MuiPickersCalendarHeader-labelContainer': {
                  marginLeft: 1,
                  marginRight: 0,
                },
                '& .MuiPickersArrowSwitcher-root': {
                  position: 'absolute',
                  left: '30px'
                }
              }}
            >
              <DateCalendar
                key={currentMonth.format('YYYY-MM')}
                value={null} // Controlled by CustomPickersDay highlighting
                referenceDate={currentMonth}
                onMonthChange={(newMonth) => setCurrentMonth(newMonth)}
                onChange={handleDateClick}
                views={['day']}
                slots={{ day: CustomPickersDay }}
                sx={{
                  height: '100%',
                  width: CALENDAR_WIDTH,
                  '& .MuiPickersSlideTransition-root': {
                    minHeight: '200px'
                  }
                }}
              />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

            <Box
              sx={{
                width: CALENDAR_WIDTH,
                display: 'flex',
                flexDirection: 'column',
                // Control Nav Buttons via CSS: Hide Prev button
                '& .MuiPickersArrowSwitcher-root button[title="Previous month"]': { display: 'none' },
                '& .MuiPickersCalendarHeader-root': {
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                '& .MuiPickersCalendarHeader-labelContainer': {
                  marginLeft: 1,
                  marginRight: 0,
                },
                '& .MuiPickersArrowSwitcher-root': {
                  position: 'absolute',
                  right: '30px'
                }
              }}
            >
              <DateCalendar
                key={currentMonth.add(1, 'month').format('YYYY-MM')}
                value={null} // Controlled by CustomPickersDay highlighting
                referenceDate={currentMonth.add(1, 'month')}
                onMonthChange={(newMonth) => setCurrentMonth(newMonth.subtract(1, 'month'))} // Sync back to start month
                onChange={handleDateClick}
                views={['day']}
                slots={{ day: CustomPickersDay }}
                sx={{
                  height: '100%',
                  width: CALENDAR_WIDTH,
                  '& .MuiPickersSlideTransition-root': {
                    minHeight: '200px'
                  }
                }}
              />
            </Box>

          </Box>

          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1,
              pt: 1,
            }}
          >
            <Button size="small" onClick={handleClear} color="error">
              Clear
            </Button>
            <Button size="small" variant="contained" onClick={handleClose}>
              Done
            </Button>
          </Box>
        </Stack>
      </Popover>
    </LocalizationProvider>
  );
}
