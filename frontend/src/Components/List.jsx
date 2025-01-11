import { useState, useEffect } from 'react';
import { Button, Typography, Grid, Paper, CircularProgress, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from './Modal'; 

function List({ currentComponent, setDashboard }) {
  const [isModalOpen, openModal] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    openModal(false);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url = '';

      if (currentComponent === 'events') {
        url = 'http://localhost:5000/getEvents';
      } else if (currentComponent === 'attendance') {
        url = 'http://localhost:5000/getAttendance';
      } else if (currentComponent === 'tasks') {
        url = 'http://localhost:5000/getTasks';
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${currentComponent}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Failed to fetch ${currentComponent}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentComponent) {
      fetchData();
    }
  }, [currentComponent]);

  const submit = async (formData) => {
	console.log(formData);
    const endpoints = {
      events: {
        url: isEditing ? 'http://localhost:5000/updateEvent' : 'http://localhost:5000/addevent',
        method: isEditing ? 'PUT' : 'POST',
      },
      attendance: {
        url: isEditing ? 'http://localhost:5000/updateAttendance' : 'http://localhost:5000/addattendance',
        method: isEditing ? 'PUT' : 'POST',
      },
      tasks: {
        url: isEditing ? 'http://localhost:5000/updateTask' : 'http://localhost:5000/addtask',
        method: isEditing ? 'PUT' : 'POST',
      },
    };

    const { url, method } = endpoints[currentComponent];
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModal();
        fetchData(); 
      } else {
        console.error('Error processing request');
        alert(`Error processing request. Please try again.`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    openModal(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsEditing(false);
    openModal(true);
  };

  const removeItem = async (id) => {
    try {
      const url =
        currentComponent === 'events'
          ? 'http://localhost:5000/removeEvent'
          : currentComponent === 'attendance'
          ? 'http://localhost:5000/removeAttendance'
          : 'http://localhost:5000/removeTask';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setData(data.filter((item) => item._id !== id));
      } else {
        console.error('Error removing item');
        alert('Error removing item. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  const getDisplayName = (obj) => {
    if (currentComponent === 'events') return obj.eventname;
    if (currentComponent === 'attendance') return obj.attendeeName;
    if (currentComponent === 'tasks') return obj.taskName;
    return '';
  };

  return (
    <Paper style={{ width: '100%', padding: '1rem', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {currentComponent.charAt(0).toUpperCase() + currentComponent.slice(1)} List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddItem}
        style={{ marginBottom: '1rem' }}
      >
        Add {currentComponent}
      </Button>
      <Modal isopen={isModalOpen} onClose={closeModal} onSubmit={submit} eventData={selectedItem} isEditing={isEditing} currentComponent={currentComponent}/>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container direction="column" spacing={2}>
          {data.map((obj) => (
            <Grid item key={obj._id}>
              <Paper elevation={3} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <Typography onClick={() => setDashboard(obj)} style={{ cursor: 'pointer' }}>
                  {getDisplayName(obj)}
                </Typography>
                <div>
                  <IconButton onClick={() => handleEdit(obj)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => removeItem(obj._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}

export default List;
