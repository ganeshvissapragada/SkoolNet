import React, { useState, useEffect } from 'react';
import api from '../api/api.js';

export default function TeacherDashboard() {
  const [attendance, setAttendance] = useState({ studentId: '', date: '', status: 'Present' });
  const [marks, setMarks] = useState({ studentId: '', subjectId: '', marksObtained: '', totalMarks: '', examType: 'Unit Test', date: '' });
  const [ptm, setPtm] = useState({
    parent_id: '',
    student_id: '',
    meeting_date: '',
    meeting_time: '',
    duration: 30,
    reason: '',
    agenda: '',
    location: ''
  });
  const [students, setStudents] = useState([]);
  const [ptms, setPtms] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');

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

  const fetchStudents = async () => {
    try {
      const res = await api.get('/teacher/students-for-ptm');
      setStudents(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch students');
    }
  };

  const fetchPTMs = async () => {
    try {
      const res = await api.get('/teacher/ptms');
      setPtms(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch PTMs');
    }
  };

  const submitPTM = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/teacher/ptm', ptm);
      setResult(res.data);
      setPtm({
        parent_id: '',
        student_id: '',
        meeting_date: '',
        meeting_time: '',
        duration: 30,
        reason: '',
        agenda: '',
        location: ''
      });
      fetchPTMs();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to schedule PTM');
    }
  };

  const updatePTMStatus = async (ptmId, status) => {
    try {
      const res = await api.put(`/teacher/ptm/${ptmId}/status`, { status });
      setResult(res.data);
      fetchPTMs();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update PTM status');
    }
  };

  const fetchMealPlans = async () => {
    try {
      const res = await api.get('/teacher/meal-plans/today');
      setMealPlans(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal plans');
    }
  };

  const markMealConsumption = async (e) => {
    e.preventDefault();
    if (!selectedMealPlan || selectedStudents.length === 0) {
      setError('Please select a meal plan and at least one student');
      return;
    }

    try {
      const res = await api.post('/teacher/meal-consumption', {
        meal_plan_id: selectedMealPlan,
        student_ids: selectedStudents,
        notes: 'Marked by teacher'
      });
      setResult(res.data);
      setSelectedStudents([]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to mark meal consumption');
    }
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const selectedStudent = students.find(s => s.id === parseInt(studentId));
    setPtm(prev => ({
      ...prev,
      student_id: studentId,
      parent_id: selectedStudent ? selectedStudent.parent?.id || '' : ''
    }));
  };

  useEffect(() => {
    if (activeTab === 'ptm') {
      fetchStudents();
      fetchPTMs();
    }
    if (activeTab === 'meals') {
      fetchStudents();
      fetchMealPlans();
    }
  }, [activeTab]);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Teacher Dashboard</h2>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: 24, borderBottom: '1px solid #ccc' }}>
        <button 
          onClick={() => setActiveTab('attendance')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            backgroundColor: activeTab === 'attendance' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'attendance' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Attendance
        </button>
        <button 
          onClick={() => setActiveTab('marks')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            backgroundColor: activeTab === 'marks' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'marks' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Marks
        </button>
        <button 
          onClick={() => setActiveTab('ptm')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            backgroundColor: activeTab === 'ptm' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'ptm' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Parent-Teacher Meetings
        </button>
        <button 
          onClick={() => setActiveTab('meals')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'meals' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'meals' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Meal Management
        </button>
      </div>

      {activeTab === 'attendance' && (
        <div>
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
        </div>
      )}

      {activeTab === 'marks' && (
        <div>
          <h3>Add Marks</h3>
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
        </div>
      )}

      {activeTab === 'ptm' && (
        <div>
          <h3>Schedule Parent-Teacher Meeting</h3>
          <form onSubmit={submitPTM} style={{ maxWidth: 500, marginBottom: 24 }}>
            <select
              value={ptm.student_id}
              onChange={handleStudentChange}
              style={{ width: '100%', marginBottom: 8 }}
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (Class: {student.class} {student.section}) - Parent: {student.parent?.name}
                </option>
              ))}
            </select>
            
            <input
              type="date"
              value={ptm.meeting_date}
              onChange={(e) => setPtm(prev => ({ ...prev, meeting_date: e.target.value }))}
              style={{ width: '100%', marginBottom: 8 }}
              required
            />
            
            <input
              type="time"
              value={ptm.meeting_time}
              onChange={(e) => setPtm(prev => ({ ...prev, meeting_time: e.target.value }))}
              style={{ width: '100%', marginBottom: 8 }}
              required
            />
            
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={ptm.duration}
              onChange={(e) => setPtm(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
              style={{ width: '100%', marginBottom: 8 }}
              min="15"
              max="120"
            />
            
            <textarea
              placeholder="Reason for meeting"
              value={ptm.reason}
              onChange={(e) => setPtm(prev => ({ ...prev, reason: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, height: 60 }}
              required
            />
            
            <textarea
              placeholder="Agenda (optional)"
              value={ptm.agenda}
              onChange={(e) => setPtm(prev => ({ ...prev, agenda: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, height: 60 }}
            />
            
            <input
              placeholder="Location (optional)"
              value={ptm.location}
              onChange={(e) => setPtm(prev => ({ ...prev, location: e.target.value }))}
              style={{ width: '100%', marginBottom: 8 }}
            />
            
            <button type="submit">Schedule Meeting</button>
          </form>

          <h3>Scheduled Meetings</h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {ptms.length === 0 ? (
              <p>No meetings scheduled</p>
            ) : (
              ptms.map(meeting => (
                <div key={meeting.id} style={{
                  border: '1px solid #ddd',
                  padding: 16,
                  marginBottom: 8,
                  borderRadius: 4,
                  backgroundColor: meeting.status === 'confirmed' ? '#e7f5e7' : 
                                   meeting.status === 'cancelled' ? '#fde7e7' : '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>Student:</strong> {meeting.student?.name} (Class: {meeting.student?.class} {meeting.student?.section})<br/>
                      <strong>Parent:</strong> {meeting.parent?.name} ({meeting.parent?.email})<br/>
                      <strong>Date:</strong> {new Date(meeting.meeting_date).toLocaleDateString()}<br/>
                      <strong>Time:</strong> {meeting.meeting_time} ({meeting.duration} minutes)<br/>
                      <strong>Reason:</strong> {meeting.reason}<br/>
                      {meeting.agenda && <><strong>Agenda:</strong> {meeting.agenda}<br/></>}
                      {meeting.location && <><strong>Location:</strong> {meeting.location}<br/></>}
                      <strong>Status:</strong> <span style={{
                        padding: '2px 6px',
                        borderRadius: 3,
                        fontSize: '0.8em',
                        backgroundColor: meeting.status === 'scheduled' ? '#fff3cd' :
                                       meeting.status === 'confirmed' ? '#d4edda' :
                                       meeting.status === 'completed' ? '#cce7ff' : '#f8d7da',
                        color: meeting.status === 'scheduled' ? '#856404' :
                               meeting.status === 'confirmed' ? '#155724' :
                               meeting.status === 'completed' ? '#004085' : '#721c24'
                      }}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      {meeting.status === 'scheduled' && (
                        <button 
                          onClick={() => updatePTMStatus(meeting.id, 'cancelled')}
                          style={{ marginLeft: 8, padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      )}
                      {meeting.status === 'confirmed' && (
                        <button 
                          onClick={() => updatePTMStatus(meeting.id, 'completed')}
                          style={{ marginLeft: 8, padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer' }}
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'meals' && (
        <div>
          <h3>Today's Meal Plans</h3>
          <div style={{ maxWidth: 500, marginBottom: 24 }}>
            {mealPlans.length === 0 ? (
              <p>No meal plans available for today</p>
            ) : (
              mealPlans.map(meal => (
                <div key={meal.id} style={{
                  border: '1px solid #ddd',
                  padding: 16,
                  marginBottom: 8,
                  borderRadius: 4,
                  backgroundColor: '#f8f9fa'
                }}>
                  <strong>{meal.name}</strong><br/>
                  <span style={{ fontSize: '0.9em', color: '#555' }}>{meal.description}</span><br/>
                  <strong>Ingredients:</strong> {meal.ingredients.join(', ')}<br/>
                  <strong>Allergens:</strong> {meal.allergens.length > 0 ? meal.allergens.join(', ') : 'None'}<br/>
                  <strong>Dietary Info:</strong> {meal.dietaryInfo}<br/>
                  <strong>Calories:</strong> {meal.calories} kcal
                </div>
              ))
            )}
          </div>

          <h3>Mark Meal Consumption</h3>
          <form onSubmit={markMealConsumption} style={{ maxWidth: 500 }}>
            <select
              value={selectedMealPlan}
              onChange={(e) => setSelectedMealPlan(e.target.value)}
              style={{ width: '100%', marginBottom: 8 }}
              required
            >
              <option value="">Select Meal Plan</option>
              {mealPlans.map(meal => (
                <option key={meal.id} value={meal.id}>
                  {meal.name} - {meal.calories} kcal
                </option>
              ))}
            </select>

            <div style={{ marginBottom: 16 }}>
              <strong>Select Students:</strong>
              {students.map(student => (
                <div key={student.id} style={{ marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudentSelection(student.id)}
                    style={{ marginRight: 8 }}
                  />
                  <label htmlFor={`student-${student.id}`}>
                    {student.name} (Class: {student.class} {student.section})
                  </label>
                </div>
              ))}
            </div>
            
            <button type="submit">Mark Consumption</button>
          </form>
        </div>
      )}

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {result && (
        <pre style={{ background: '#f6f8fa', padding: 16, marginTop: 16 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}