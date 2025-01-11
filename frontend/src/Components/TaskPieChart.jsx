import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FF8042', '#00C49F'];

const TaskPieChart = ({ pending, completed }) => {
  const taskData = [
    { name: 'Pending Tasks', value: pending },
    { name: 'Completed Tasks', value: completed },
  ];

  return (

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
  <PieChart width={500} height={400}>
         <Pie
          data={taskData}
          cx="50%" 
          cy="50%" 
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={150} 
          fill="#8884d8"
          dataKey="value"
        >
          {taskData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default TaskPieChart;
