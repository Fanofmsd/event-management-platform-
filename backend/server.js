const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

const eventSchema = new mongoose.Schema({
  eventname: { type: String, required: true },
  eventdescription: { type: String, required: true },
  eventplace: { type: String, required: true },
  eventdate: { type: Date, required: true },
  eventattendances: [
    {
      attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }, 
	attendeeName:String
    }
  ],
taskslist:[
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, 
taskName:String   
}

]
});

const Event = mongoose.model('Event', eventSchema);
const attendanceSchema = new mongoose.Schema({
  attendeeName: { type: String, required: true },
  attendeeEmail: { type: String, required: true },
  attendeeNumber: { type: Number, required: true },
  assignedTasks: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, 
	taskName:String    
}
  ],
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, 
  assignedTo: [
    {
      attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }, 
      attendeeName: String 

    }
  ],
});

const Task = mongoose.model('Task', taskSchema);

const users = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'password123' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.get('/getEvents', async (req, res) => {
  try {
    const events = await Event.find().populate('taskslist.taskId');
    const eventsWithTaskInfo = events.map(event => {
      const totalTasks = event.taskslist.length;
      const pendingTasks = event.taskslist.filter(task => task.taskId && task.taskId.status === 'Pending').length;
      const completedTasks = event.taskslist.filter(task => task.taskId && task.taskId.status === 'Completed').length;

      return {
        ...event._doc, 
        totalTasks,   
        pendingTasks, 
        completedTasks 
      };
    });

    res.status(200).json(eventsWithTaskInfo); 
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

app.post('/addevent', async (req, res) => {
  const { eventname, eventdescription, eventplace, eventdate,eventattendances } = req.body;

  const newEvent = new Event({
    eventname,
    eventdescription,
    eventplace,
    eventdate,
eventattendances
  });

  try {
    await newEvent.save();
    res.status(200).json({ message: 'Event added successfully!' });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event', error });
  }
});

app.post('/removeEvent', async (req, res) => {
  const { id } = req.body; 
  try {
    const result = await Event.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event removed successfully!' });
  } catch (error) {
    console.error('Error removing event:', error);
    res.status(500).json({ message: 'Error removing event', error });
  }
});

app.put('/updateEvent', async (req, res) => {
  const { _id,eventname, eventdescription, eventplace, eventdate} = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(_id, { eventname, eventdescription, eventplace, eventdate }, { new: true });
console.log(updatedEvent);
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully!', event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error });
  }
});


app.post('/addattendance', async (req, res) => {
  const { attendeeName, attendeeEmail,attendeeNumber,taskId } = req.body;
console.log(req.body);
  const newAttendance = new Attendance({
    attendeeName,
attendeeEmail,
    attendeeNumber,
    taskId,
  });

  try {
    await newAttendance.save();
    res.status(200).json({ message: 'Attendance added successfully!' });
  } catch (error) {
    console.error('Error adding attendance:', error);
    res.status(500).json({ message: 'Error adding attendance', error });
  }
});

app.get('/getAttendance', async (req, res) => {
  try {
    const attendance = await Attendance.find(); 
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
});

app.put('/updateAttendence', async (req, res) => {
  const { id, status } = req.body;

  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance updated successfully!', attendance: updatedAttendance });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance', error });
  }
});

app.post('/removeAttendance', async (req, res) => {
  const { id } = req.body; 
  try {
    const result = await Attendance.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance removed successfully!' });
  } catch (error) {
    console.error('Error removing attendance:', error);
    res.status(500).json({ message: 'Error removing attendance', error });
  }
});

app.post('/addtask', async (req, res) => {
  const { taskName, taskDescription, deadline, status, eventId } = req.body;
  
  const newTask = new Task({ taskName, taskDescription, deadline, status, eventId });

  try {
    const savedTask = await newTask.save();

    const taskId = savedTask._id;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId, 
      { $push: { taskslist: { taskId, taskName } } },  
      { new: true }  
    );

    res.status(200).json({ 
      message: 'Task added successfully!', 
      task: savedTask, 
      updatedEvent 
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Error adding task', error });
  }
});

app.get('/getTasks', async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});



app.put('/updateTask', async (req, res) => {

  const { _id, taskName,taskDescription, deadline, status,eventId } = req.body; 

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      { taskName,taskDescription, deadline, status,eventId },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully!', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error });
  }
});

app.post('/removeTask', async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Task.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task removed successfully!' });
  } catch (error) {
    console.error('Error removing task:', error);
    res.status(500).json({ message: 'Error removing task', error });
  }
});

app.put('/assignAttendance', async (req, res) => {
  const { taskId, eventId, attendeeId,attendeeName ,taskName} = req.body; 
console.log(req.body);
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendeeId,{$push:{ assignedTasks: {taskId,taskName} }}, 
      { new: true }     );

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,  
      { eventattendances: {attendeeId,attendeeName} },  
      { new: true }  
    );
const updatedTask = await Task.findByIdAndUpdate(taskId, { $push: {assignedTo: {attendeeId,attendeeName }}},{ new: true });
   
 if (!updatedAttendance || !updatedEvent || !updatedTask) {
      return res.status(404).json({ message: 'Attendance or Event not found' });
    }
    res.status(200).json({ message: 'Attendance and Event updated successfully!', attendance: updatedAttendance, event: updatedEvent });
  } catch (error) {
    console.error('Error updating attendance and event:', error);
    res.status(500).json({ message: 'Error updating attendance and event', error });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
