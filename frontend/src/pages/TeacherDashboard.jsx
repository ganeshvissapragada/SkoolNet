import React, { useState, useEffect } from 'react';
import api from '../api/api.js';

export default function TeacherDashboard() {
  // Class and Section Management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [availableClasses] = useState(['6', '7', '8', '9', '10']);
  const [availableSections] = useState(['A', 'B']);
  
  // Student Data
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // Form States
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
  
  // Other States
  const [ptms, setPtms] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');

  const submitAttendance = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/teacher/attendance', attendance);
      
      // Find the student name for the success message
      const selectedStudent = filteredStudents.find(s => s.id === parseInt(attendance.studentId));
      const studentName = selectedStudent ? selectedStudent.name : `Student ID ${attendance.studentId}`;
      
      // Show success message instead of raw JSON
      setResult({
        success: true,
        message: `✅ Attendance marked successfully for ${studentName}!`,
        details: `Status: ${attendance.status} | Date: ${new Date(attendance.date).toLocaleDateString()}`,
        data: res.data
      });
      
      // Clear form after successful submission
      setAttendance({ studentId: '', date: '', status: 'Present' });
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
      
      // Find the student name for the success message
      const selectedStudent = filteredStudents.find(s => s.id === parseInt(marks.studentId));
      const studentName = selectedStudent ? selectedStudent.name : `Student ID ${marks.studentId}`;
      const percentage = payload.totalMarks > 0 ? ((payload.marksObtained / payload.totalMarks) * 100).toFixed(1) : 0;
      
      // Show success message instead of raw JSON
      setResult({
        success: true,
        message: `✅ Marks saved successfully for ${studentName}!`,
        details: `Score: ${payload.marksObtained}/${payload.totalMarks} (${percentage}%) | Subject ID: ${payload.subjectId} | Exam: ${payload.examType}`,
        data: res.data
      });
      
      // Clear form after successful submission
      setMarks({ studentId: '', subjectId: '', marksObtained: '', totalMarks: '', examType: 'Unit Test', date: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save marks');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/teacher/students-by-class');
      setStudents(res.data.students || []);
      filterStudents(res.data.students || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch students');
    }
  };

  const filterStudents = (studentList = students) => {
    let filtered = studentList;
    
    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass);
    }
    
    if (selectedSection) {
      filtered = filtered.filter(student => student.section === selectedSection);
    }
    
    setFilteredStudents(filtered);
  };

  // Update filtered students when class or section changes
  useEffect(() => {
    filterStudents();
  }, [selectedClass, selectedSection, students]);

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
      
      // Find the student name for the success message
      const selectedStudent = filteredStudents.find(s => s.id === parseInt(ptm.student_id));
      const studentName = selectedStudent ? selectedStudent.name : `Student ID ${ptm.student_id}`;
      const meetingDateTime = `${new Date(ptm.meeting_date).toLocaleDateString()} at ${ptm.meeting_time}`;
      
      // Show success message instead of raw JSON
      setResult({
        success: true,
        message: `✅ PTM scheduled successfully with ${studentName}'s parent!`,
        details: `Meeting: ${meetingDateTime} | Duration: ${ptm.duration} minutes | Reason: ${ptm.reason}`,
        data: res.data
      });
      
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
      
      // Show success message for status update
      setResult({
        success: true,
        message: `✅ PTM status updated to "${status}" successfully!`,
        details: `Meeting ID: ${ptmId}`,
        data: res.data
      });
      
      fetchPTMs();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update PTM status');
    }
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
    fetchStudents(); // Always fetch students when component mounts
    
    if (activeTab === 'ptm') {
      fetchPTMs();
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
      </div>

      {activeTab === 'attendance' && (
        <div>
          <h3>📋 Take Attendance</h3>
          
          {/* Class and Section Selection */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 16, 
            maxWidth: 500, 
            marginBottom: 20,
            padding: 16,
            backgroundColor: '#f8f9fa',
            borderRadius: 8
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Select Class</option>
                {availableClasses.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Select Section</option>
                {availableSections.map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={submitAttendance} style={{ maxWidth: 500 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Student</label>
            <select
              value={attendance.studentId}
              onChange={(e) => setAttendance((a) => ({ ...a, studentId: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            >
              <option value="">Select Student</option>
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (Class {student.class}-{student.section})
                </option>
              ))}
            </select>
            
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Date</label>
            <input
              type="date"
              value={attendance.date}
              onChange={(e) => setAttendance((a) => ({ ...a, date: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
            
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Status</label>
            <select
              value={attendance.status}
              onChange={(e) => setAttendance((a) => ({ ...a, status: e.target.value }))}
              style={{ width: '100%', marginBottom: 16, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            
            <button 
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              ✅ Mark Attendance
            </button>
          </form>
        </div>
      )}

      {activeTab === 'marks' && (
        <div>
          <h3>📊 Add Marks</h3>
          
          {/* Class and Section Selection */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 16, 
            maxWidth: 500, 
            marginBottom: 20,
            padding: 16,
            backgroundColor: '#f8f9fa',
            borderRadius: 8
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Select Class</option>
                {availableClasses.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
              >
                <option value="">Select Section</option>
                {availableSections.map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={submitMarks} style={{ maxWidth: 500 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Student</label>
            <select
              value={marks.studentId}
              onChange={(e) => setMarks((m) => ({ ...m, studentId: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            >
              <option value="">Select Student</option>
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (Class {student.class}-{student.section})
                </option>
              ))}
            </select>
            
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Subject ID</label>
            <input
              placeholder="Subject ID (e.g., 1 for Math, 2 for Science)"
              value={marks.subjectId}
              onChange={(e) => setMarks((m) => ({ ...m, subjectId: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Marks Obtained</label>
                <input
                  type="number"
                  placeholder="85"
                  value={marks.marksObtained}
                  onChange={(e) => setMarks((m) => ({ ...m, marksObtained: e.target.value }))}
                  style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Total Marks</label>
                <input
                  type="number"
                  placeholder="100"
                  value={marks.totalMarks}
                  onChange={(e) => setMarks((m) => ({ ...m, totalMarks: e.target.value }))}
                  style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                />
              </div>
            </div>
            
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Exam Type</label>
            <select
              value={marks.examType}
              onChange={(e) => setMarks((m) => ({ ...m, examType: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            >
              <option value="Unit Test">Unit Test</option>
              <option value="Mid Term">Mid Term</option>
              <option value="Final Exam">Final Exam</option>
              <option value="Assignment">Assignment</option>
              <option value="Project">Project</option>
            </select>
            
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Date</label>
            <input
              type="date"
              value={marks.date}
              onChange={(e) => setMarks((m) => ({ ...m, date: e.target.value }))}
              style={{ width: '100%', marginBottom: 16, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
            
            <button 
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              📊 Save Marks
            </button>
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

      {error && (
        <div style={{
          color: '#721c24',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: 4,
          padding: 12,
          marginTop: 16
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          color: result.success ? '#155724' : '#721c24',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: result.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          borderRadius: 4,
          padding: 12,
          marginTop: 16
        }}>
          {result.success ? (
            <div>
              <strong>{result.message}</strong>
              {result.details && (
                <div style={{ marginTop: 8, fontSize: '0.9em' }}>
                  {result.details}
                </div>
              )}
            </div>
          ) : (
            <pre style={{ background: 'transparent', padding: 0, margin: 0, fontSize: '0.9em' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}