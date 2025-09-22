import React, { useContext, useState } from 'react';
import api from '../api/api.js';
import { AuthContext } from '../auth/AuthContext.jsx';

export default function ParentDashboard() {
  const { userId } = useContext(AuthContext);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);

  const loadAttendance = async () => {
    const res = await api.get(`/parent/attendance/child/${userId}`);
    setAttendance(res.data);
  };
  const loadMarks = async () => {
    const res = await api.get(`/parent/marks/child/${userId}`);
    setMarks(res.data);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Parent Dashboard</h2>
      <div>
        <button onClick={loadAttendance}>Load Child Attendance</button>
        <button onClick={loadMarks} style={{ marginLeft: 8 }}>Load Child Marks</button>
      </div>
      {attendance && (
        <>
          <h3>Attendance</h3>
          <pre style={{ background: '#f6f8fa', padding: 16 }}>{JSON.stringify(attendance, null, 2)}</pre>
        </>
      )}
      {marks && (
        <>
          <h3>Marks</h3>
          <pre style={{ background: '#f6f8fa', padding: 16 }}>{JSON.stringify(marks, null, 2)}</pre>
        </>
      )}
    </div>
  );
}