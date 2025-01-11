import { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';  

function Modal({ isopen, onClose, onSubmit, eventData, isEditing, currentComponent }) {
  const [formData, setFormData] = useState({
    eventname: '',
    eventdescription: '',
    eventplace: '',
    eventdate: '',
    attendeeName: '',
    attendeeEmail: '',
    attendeeNumber: '',
    taskName: '',
    taskDescription: '',
    deadline: '',
    status: 'Pending',
    eventId: '', 
  });

  const [events, setEvents] = useState([]); 
  useEffect(() => {
    if (isopen && currentComponent === 'tasks') {
      const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:5000/getEvents'); 
          setEvents(response.data); // Set the events data
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };
      fetchEvents();
    }
  }, [isopen, currentComponent]);

  useEffect(() => {
    if (eventData) {
      setFormData(eventData);
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
    setFormData({
      eventname: '',
      eventdescription: '',
      eventplace: '',
      eventdate: '',
      attendeeName: '',
      attendeeEmail: '',
      attendeeNumber: '',
      taskName: '',
      taskDescription: '',
      deadline: '',
      status: 'Pending',
      eventId: '', 
    });
  };

  const renderFormFields = () => {
    switch (currentComponent) {
      case 'events':
        return (
          <>
            <div style={styles.inputGroup}>
              <label>Event Name:</label>
              <input type="text" name="eventname" value={formData.eventname} onChange={handleChange} style={styles.input}/>
            </div>
            <div style={styles.inputGroup}>
              <label>Event Description:</label>
              <input type="text" name="eventdescription" value={formData.eventdescription} onChange={handleChange} style={styles.input}/>
            </div>
            <div style={styles.inputGroup}>
              <label>Event Place:</label>
              <input type="text" name="eventplace" value={formData.eventplace} onChange={handleChange} style={styles.input}/>
            </div>
            <div style={styles.inputGroup}>
              <label>Event Date:</label>
              <input type="date" name="eventdate" value={formData.eventdate} onChange={handleChange} style={styles.input}/>
            </div>
          </>
        );
      case 'attendance':
        return (
          <>
            <div style={styles.inputGroup}>
              <label>Attendee Name:</label>
              <input type="text" name="attendeeName" value={formData.attendeeName} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label>Attendee Email:</label>
              <input type="email" name="attendeeEmail" value={formData.attendeeEmail} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label>Attendee Number:</label>
              <input type="number" name="attendeeNumber" value={formData.attendeeNumber} onChange={handleChange} style={styles.input} />
            </div>
          </>
        );
      case 'tasks':
        return (
          <>
            <div style={styles.inputGroup}>
              <label>Task Name:</label>
              <input type="text" name="taskName" value={formData.taskName} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label>Task Description:</label>
              <input type="text" name="taskDescription" value={formData.taskDescription} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label>Deadline:</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label>Status:</label>
              <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label>Event:</label>
              <select name="eventId" value={formData.eventId} onChange={handleChange} style={styles.input}>
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.eventname}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    isopen && (
      <div style={styles.modal}>
        <div className="modalContent">
          <span style={styles.closeButton} onClick={onClose}>X</span>
          <h2>{isEditing ? `Edit ${currentComponent.slice(0, -1)}` : `Add ${currentComponent.slice(0, -1)}`}</h2>
          <form onSubmit={handleSubmit}>
            {renderFormFields()}  {/* Render conditional fields based on component */}
            <div style={styles.buttonContainer}>
              <button type="submit" style={styles.submitButton}>
                {isEditing ? `Update ${currentComponent.slice(0, -1)}` : `Add ${currentComponent.slice(0, -1)}`}
              </button>
              <button type="button" onClick={onClose} style={styles.closeModalButton}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
 modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    maxHeight: '80vh', 
    overflowY: 'auto', 
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '18px',
  },
  inputGroup: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeModalButton: {
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Modal;
