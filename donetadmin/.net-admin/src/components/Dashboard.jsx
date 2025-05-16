import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { 
  Add as AddIcon,
  Event as EventIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // 检查该日期是否有事件
    const dateStr = format(date, 'yyyy-MM-dd');
    if (events[dateStr] && events[dateStr].length > 0) {
      setSnackbarMessage(`${events[dateStr].length} events on this date`);
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = () => {
    setEventTitle('');
    setEventDescription('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim()) {
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      description: eventDescription,
      date: dateStr
    };

    setEvents(prev => {
      const updatedEvents = { ...prev };
      if (!updatedEvents[dateStr]) {
        updatedEvents[dateStr] = [];
      }
      updatedEvents[dateStr] = [...updatedEvents[dateStr], newEvent];
      return updatedEvents;
    });

    setSnackbarMessage('Event added successfully!');
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteEvent = (eventId, dateStr) => {
    setEvents(prev => {
      const updatedEvents = { ...prev };
      updatedEvents[dateStr] = updatedEvents[dateStr].filter(event => event.id !== eventId);
      if (updatedEvents[dateStr].length === 0) {
        delete updatedEvents[dateStr];
      }
      return updatedEvents;
    });

    setSnackbarMessage('Event deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dateEvents = events[dateStr] || [];

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#4caf50', 
            fontWeight: 'bold', 
            mb: 3, 
            textAlign: 'center',
            fontSize: { xs: '1.8rem', md: '2.2rem' }
          }}
        >
          Calendar
        </Typography>
        
        <Grid container spacing={3}>
          {/* 日历部分 */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper 
              sx={{ 
                p: 2,
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                width: '100%',
                height: '100%',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar 
                  value={selectedDate}
                  onChange={handleDateChange}
                  sx={{
                    width: '100%',
                    height: '100%',
                    '& .MuiPickersCalendarHeader-root': {
                      paddingLeft: 2,
                      paddingRight: 2,
                      marginTop: 1,
                      marginBottom: 1,
                    },
                    '& .MuiDayCalendar-header': {
                      justifyContent: 'space-around',
                      paddingLeft: 1,
                      paddingRight: 1,
                    },
                    '& .MuiDayCalendar-monthContainer': {
                      justifyContent: 'space-around',
                    },
                    '& .MuiPickersDay-root': {
                      width: '40px',
                      height: '40px',
                      fontSize: '1rem',
                      margin: '4px',
                    },
                    '& .MuiPickersDay-root.Mui-selected': {
                      backgroundColor: '#4caf50',
                    },
                    '& .MuiPickersDay-root:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    },
                    '& .MuiTypography-root': {
                      color: '#fff',
                    }
                  }}
                  renderDay={(day, _value, DayComponentProps) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayEvents = events[dateStr] || [];
                    const hasEvents = dayEvents.length > 0;
                    
                    return (
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          '&::after': hasEvents ? {
                            content: '""',
                            position: 'absolute',
                            bottom: '2px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#4caf50',
                          } : {}
                        }}
                      >
                        <DayComponentProps.Day {...DayComponentProps} />
                        {hasEvents && dayEvents.length > 1 && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              position: 'absolute',
                              bottom: '-4px',
                              fontSize: '0.6rem',
                              color: '#4caf50',
                              fontWeight: 'bold'
                            }}
                          >
                            {dayEvents.length}
                          </Typography>
                        )}
                      </Box>
                    );
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>
          
          {/* 事件列表部分 */}
          <Grid item xs={12} md={5}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                height: '100%',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Events for {format(selectedDate, 'MMMM d, yyyy')}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  Add Event
                </Button>
              </Box>
              
              {dateEvents.length > 0 ? (
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                  {dateEvents.map(event => (
                    <Paper 
                      key={event.id}
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        background: 'rgba(40, 40, 40, 0.7)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 0 8px rgba(76, 175, 80, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <EventIcon sx={{ mr: 1, color: '#4caf50' }} />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {event.title}
                            </Typography>
                            {event.description && (
                              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                {event.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteEvent(event.id, dateStr)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': {
                              color: '#f44336',
                              backgroundColor: 'rgba(244, 67, 54, 0.1)'
                            }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexGrow: 1,
                  color: 'text.secondary'
                }}>
                  <CalendarIcon sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>No events for this date</Typography>
                  <Typography variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
                    Click the button below to add your first event
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="medium" 
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                  >
                    ADD EVENT
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* 添加月度事件概览 */}
        <Paper 
          sx={{ 
            p: 3,
            mt: 3,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#4caf50' }}>
            Upcoming Events
          </Typography>
          
          <Grid container spacing={2}>
            {Object.keys(events).length > 0 ? (
              Object.entries(events)
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .slice(0, 3)
                .map(([date, dateEvents]) => (
                  <Grid item xs={12} md={4} key={date}>
                    <Paper 
                      sx={{ 
                        p: 2,
                        background: 'rgba(40, 40, 40, 0.7)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 0 8px rgba(76, 175, 80, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleDateChange(new Date(date))}
                    >
                      <Typography variant="subtitle2" sx={{ color: '#4caf50', mb: 1 }}>
                        {format(new Date(date), 'MMMM d, yyyy')}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {dateEvents.length} event{dateEvents.length > 1 ? 's' : ''}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {dateEvents.slice(0, 2).map(event => (
                          <Box key={event.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '90%'
                              }}
                            >
                              {event.title}
                            </Typography>
                          </Box>
                        ))}
                        {dateEvents.length > 2 && (
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            And {dateEvents.length - 2} more...
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 3,
                  color: 'text.secondary'
                }}>
                  <Typography variant="body1">No upcoming events</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{ mt: 2 }}
                  >
                    ADD YOUR FIRST EVENT
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>

      {/* 添加事件对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', color: '#4caf50', fontWeight: 'bold' }}>
          Add Event for {format(selectedDate, 'MMMM d, yyyy')}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            type="text"
            fullWidth
            variant="outlined"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Event Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleAddEvent} 
            color="primary" 
            variant="contained" 
            disabled={!eventTitle.trim()}
          >
            Add Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* 通知消息 */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Dashboard; 