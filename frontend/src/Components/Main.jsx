import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Paper, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

import List from './List';
import Dashboard from './Dashboard';

function Main() {
  const [currentDashboard, setDashboard] = useState([]);
  const [currentView, setCurrentView] = useState('events');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div>
      <AppBar position="static" color="primary" style={{ height: '80px' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            WebKnot Technologies Event Management System
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} edge="end">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} justifyContent="center" style={{ marginTop: '2rem' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => setCurrentView('events')}>
                Manage Events
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => setCurrentView('attendance')}>
                Manage Attendance
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => setCurrentView('tasks')}>
                Manage Tasks
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ width: '100%' }}>
          {currentView === 'events' && (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Event Management
              </Typography>
              <Grid container spacing={3} justifyContent="center" style={{ height: '65vh', display: 'flex', flexWrap: 'wrap' }}>
                <Grid item xs={12} md={3}>
                  <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
                    <List setDashboard={setDashboard} currentComponent="events" />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
                    <Dashboard currentDashboard={currentDashboard} currentComponent="events" />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {currentView === 'attendance' && (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Attendance Management
              </Typography>
              <Grid container spacing={3} justifyContent="center" style={{ height: '65vh', display: 'flex', flexWrap: 'wrap' }}>
                <Grid item xs={12} md={3}>
                  <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
                    <List setDashboard={setDashboard} currentComponent="attendance" />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
                    <Dashboard currentDashboard={currentDashboard} currentComponent="attendance" />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {currentView === 'tasks' && (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                Task Management
              </Typography>
              <Grid container spacing={3} justifyContent="center" style={{ height: '65vh', display: 'flex', flexWrap: 'wrap' }}>
                <Grid item xs={12} md={3}>
                  <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
                    <List setDashboard={setDashboard} currentComponent="tasks" />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
                    <Dashboard currentDashboard={currentDashboard} currentComponent="tasks" />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Main;
