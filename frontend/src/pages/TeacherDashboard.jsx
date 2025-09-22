import React, { useState } from 'react';
import api from '../api/api.js';

export default function TeacherDashboard() {
  const [attendance, setAttendance] = useState({ studentId: '', date: '', status: 'Present' });
  const [marks, setMarks] = useState({ studentId: '', subjectId: '', marksObtained: '', totalMarks: '', examType: 'Unit Test', date: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submitAttendance = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/teacher/attendance', attendance);
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save attendance');
    }
  };

  const submitMarks = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...marks,
        marksObtained: Number(marks.marksObtained),
        totalMarks: Number(marks.totalMarks)
      };
      const res = await api.post('/teacher/marks', payload);
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save marks');
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Teacher Dashboard</h2>

      <h3>Add Attendance</h3>
      <form onSubmit={submitAttendance} style={{ maxWidth: 500 }}>
        <input
          placeholder="Student ID"
          value={attendance.studentId}
          onChange={(e) => setAttendance((a) => ({ ...a, studentId: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="date"
          value={attendance.date}
          onChange={(e) => setAttendance((a) => ({ ...a, date: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <select
          value={attendance.status}
          onChange={(e) => setAttendance((a) => ({ ...a, status: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button type="submit">Save Attendance</button>
      </form>

      <h3 style={{ marginTop: 24 }}>Add Marks</h3>
      <form onSubmit={submitMarks} style={{ maxWidth: 500 }}>
        <input
          placeholder="Student ID"
          value={marks.studentId}
          onChange={(e) => setMarks((m) => ({ ...m, studentId: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          placeholder="Subject ID"
          value={marks.subjectId}
          onChange={(e) => setMarks((m) => ({ ...m, subjectId: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          placeholder="Marks Obtained"
          value={marks.marksObtained}
          onChange={(e) => setMarks((m) => ({ ...m, marksObtained: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          placeholder="Total Marks"
          value={marks.totalMarks}
          onChange={(e) => setMarks((m) => ({ ...m, totalMarks: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          placeholder="Exam Type"
          value={marks.examType}
          onChange={(e) => setMarks((m) => ({ ...m, examType: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="date"
          value={marks.date}
          onChange={(e) => setMarks((m) => ({ ...m, date: e.target.value }))}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit">Save Marks</button>
      </form>

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {result && (
        <pre style={{ background: '#f6f8fa', padding: 16, marginTop: 16 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}