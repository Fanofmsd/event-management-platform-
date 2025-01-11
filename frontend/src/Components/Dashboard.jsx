import { Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import axios from 'axios';  
import TaskPieChart from './TaskPieChart';

function Dashboard({ currentDashboard, currentComponent })
 {
console.log(currentDashboard); 
  const [formData, setFormData] = useState({
    attendeeId: '',
attendeeName:""
  });
  const [attendees, setAttendees] = useState([]); 
  const [loading, setLoading] = useState(false); 
  useEffect(() => {
    if (currentComponent === 'tasks') {
      fetchAttendees();
    }
  }, [currentComponent]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/getAttendance'); 
      setAttendees(response.data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setLoading(false);
    }
  };

const handleChange = (e) => {
  const { value, selectedIndex, options } = e.target;
  const selectedOptionText = options[selectedIndex].text;

  setFormData((prevFormData) => ({
    ...prevFormData,
    attendeeId: value,             
    attendeeName: selectedOptionText, 
  }));

};
	
  const handleAssignTask = async () => {
    if (!formData.attendeeId || !currentDashboard?._id) {
      alert("Please select an attendee and a valid task.");
      return;
    }

    try {
     await axios.put('http://localhost:5000/assignAttendance', {
        attendeeId: formData.attendeeId,
	eventId:currentDashboard.eventId,
	taskId:currentDashboard._id,	
	attendeeName:formData.attendeeName,
	taskName:currentDashboard.taskName
      });
      alert("Attendee assigned successfully");
    } catch (error) {
      console.error("Error assigning attendee:", error);
    }
  };

  const renderContent = () => {
    switch (currentComponent) {
      case 'events':
        return (
        <>{currentDashboard?.eventname&&<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  height: '80vh', 
  overflowY: 'auto', 
  padding: '20px'
}}>
            <Typography variant="h5" gutterBottom>
              {currentDashboard?.eventname || "Select an event from the list"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {currentDashboard?.eventdescription || "No description available"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Place:</strong> {currentDashboard?.eventplace || "Not specified"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Date:</strong> {currentDashboard?.eventdate || "Not specified"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Event attendees:</strong> {currentDashboard?.eventattendances?.map(att => att.attendeeName).join(', ') || "Not yet assigned"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Tasks list:</strong> {currentDashboard?.taskslist?.map(att => att.taskName).join(', ') || "Not yet assigned"}
            </Typography>
 <div style={{ marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <TaskPieChart pending={currentDashboard?.pendingTasks} completed={currentDashboard?.completedTasks}/>
      </div>
</div>
}
 </>
        );

      case 'tasks':
        return (
          <>{currentDashboard?.taskName&&(<div>
            <Typography variant="h5" gutterBottom>
              {currentDashboard?.taskName || "Select a task from the list"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {currentDashboard?.taskDescription || "No description available"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Deadline:</strong> {currentDashboard?.deadline || "Not specified"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Status:</strong> {currentDashboard?.status || "Pending"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Assigned attendees:</strong> {currentDashboard?.assignedTo?.map(att => att.attendeeName).join(', ') || "Not yet assigned"}
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <div>
                <select name="attendeeId" value={formData.attendeeId} onChange={handleChange} style={{ marginBottom: '1rem', width: '100%' }}>
                  <option value="">Select Attendee</option>
                  {attendees.map((attendee) => (
                    <option key={attendee._id} value={attendee._id}>
                      {attendee.attendeeName}
                    </option>
                  ))}
                </select>

                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAssignTask} style={{ marginBottom: '1rem' }}>
                  Assign Attendee
                </Button>
              </div>
            )}
</div>)}
          </>
        );

      case 'attendance':
        return (
          <>{currentDashboard?.attendeeName &&(<div>
            <Typography variant="h5" gutterBottom>
              {currentDashboard?.attendeeName || "Select an attendee from the list"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Email:</strong> {currentDashboard?.attendeeEmail || "No email provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Phone Number:</strong> {currentDashboard?.attendeeNumber || "No phone number provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Assigned tasks:</strong> {currentDashboard?.assignedTasks?.map(att => att.taskName).join(', ') || "Not yet assigned"}
            </Typography></div>)}
          </>
        );

      default:
        return <Typography variant="h5">Select an item from the list</Typography>;
    }
  };

  return (
    <Paper elevation={3} style={{ width: '100%', height: '100%', padding: '20px', overflow: 'auto' }}>
      <Box>{renderContent()}</Box>
    </Paper>
  );
}

export default Dashboard;
