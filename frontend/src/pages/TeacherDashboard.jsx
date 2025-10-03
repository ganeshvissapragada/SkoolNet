import React, { useState, useEffect } from 'react';
import api from '../api/api.js';

export default function TeacherDashboard() {
  // Teacher Assignments - Now loaded from backend
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  
  // Class and Section Management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
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

  // Assignment States
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    class_id: '',
    subject_id: '',
    assignment_type: 'homework',
    due_date: '',
    submission_deadline: '',
    is_graded: true,
    allow_late_submission: false,
    max_marks: 100,
    instructions: '',
    status: 'draft'
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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

  const fetchTeacherAssignments = async () => {
    try {
      const res = await api.get('/teacher/my-assignments');
      setTeacherAssignments(res.data.assignments || []);
      
      // Extract unique classes and subjects from assignments
      const uniqueClasses = [];
      const uniqueSubjects = [];
      
      res.data.assignmentsByClass?.forEach(assignment => {
        // Add unique classes
        const classKey = `${assignment.class.class_name}-${assignment.class.section}`;
        if (!uniqueClasses.find(c => `${c.class_name}-${c.section}` === classKey)) {
          uniqueClasses.push(assignment.class);
        }
        
        // Add unique subjects
        assignment.subjects?.forEach(subject => {
          if (!uniqueSubjects.find(s => s.id === subject.id)) {
            uniqueSubjects.push(subject);
          }
        });
      });
      
      setAssignedClasses(uniqueClasses);
      setAssignedSubjects(uniqueSubjects);
      
      // Auto-select first assigned class if none selected
      if (uniqueClasses.length > 0 && !selectedClass) {
        setSelectedClass(uniqueClasses[0].class_name);
        setSelectedSection(uniqueClasses[0].section);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch teacher assignments');
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

  // Assignment Functions
  const fetchClasses = async () => {
    try {
      console.log('🔄 Fetching classes and subjects...');
      console.log('🔑 Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      const res = await api.get('/teacher/classes-subjects');
      console.log('📊 Classes response:', res.data);
      console.log('� Full response object:', JSON.stringify(res.data, null, 2));
      console.log('�📝 Number of classes received:', (res.data.classes || []).length);
      setClasses(res.data.classes || []);
      console.log('✅ Classes set in state');
    } catch (err) {
      console.error('❌ Error fetching classes:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      
      // Temporary fallback test data to verify dropdown functionality
      console.log('🧪 Setting test data for debugging...');
      const testData = [
        {
          id: 1,
          class_name: '8',
          section: 'A',
          Subjects: [
            { id: 1, name: 'Mathematics' },
            { id: 2, name: 'Science' },
            { id: 3, name: 'English' }
          ]
        },
        {
          id: 2,
          class_name: '9',
          section: 'A',
          Subjects: [
            { id: 4, name: 'Mathematics' },
            { id: 5, name: 'Physics' },
            { id: 6, name: 'Chemistry' }
          ]
        }
      ];
      setClasses(testData);
      console.log('🧪 Test classes set:', testData);
      
      setError(err?.response?.data?.message || 'Failed to fetch classes (using test data)');
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/teacher/assignments');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch assignments');
    }
  };

  const submitAssignment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/teacher/assignments', assignmentForm);
      
      setResult({
        success: true,
        message: `✅ Assignment "${assignmentForm.title}" created successfully!`,
        details: `Type: ${assignmentForm.assignment_type} | Due: ${new Date(assignmentForm.due_date).toLocaleDateString()}`,
        data: res.data
      });
      
      setAssignmentForm({
        title: '',
        description: '',
        class_id: '',
        subject_id: '',
        assignment_type: 'homework',
        due_date: '',
        submission_deadline: '',
        is_graded: true,
        allow_late_submission: false,
        max_marks: 100,
        instructions: '',
        status: 'draft'
      });
      setShowAssignmentForm(false);
      fetchAssignments();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create assignment');
    }
  };

  const publishAssignment = async (assignmentId) => {
    try {
      const res = await api.put(`/teacher/assignments/${assignmentId}`, { status: 'published' });
      
      setResult({
        success: true,
        message: `✅ Assignment published successfully!`,
        details: `Students can now view and submit this assignment.`,
        data: res.data
      });
      
      fetchAssignments();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to publish assignment');
    }
  };

  const gradeSubmission = async (submissionId, marks, feedback) => {
    try {
      const res = await api.put(`/teacher/submissions/${submissionId}/grade`, {
        marks_obtained: marks,
        feedback: feedback
      });
      
      setResult({
        success: true,
        message: `✅ Submission graded successfully!`,
        details: `Marks: ${marks} | Feedback provided`,
        data: res.data
      });
      
      if (selectedAssignment) {
        // Refresh assignment details
        const assignmentRes = await api.get(`/teacher/assignments/${selectedAssignment.id}`);
        setSelectedAssignment(assignmentRes.data.assignment);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to grade submission');
    }
  };

  useEffect(() => {
    fetchTeacherAssignments(); // Load teacher assignments first
    fetchStudents(); // Always fetch students when component mounts
    fetchClasses(); // Always fetch classes when component mounts
    
    if (activeTab === 'ptm') {
      fetchPTMs();
    }

    if (activeTab === 'assignments') {
      fetchAssignments();
    }
  }, [activeTab]);

  // Load teacher assignments and classes once on component mount
  useEffect(() => {
    fetchTeacherAssignments();
    fetchClasses();
  }, []);

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
          onClick={() => setActiveTab('assignments')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            backgroundColor: activeTab === 'assignments' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'assignments' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Assignments
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
                {assignedClasses.map(cls => (
                  <option key={`${cls.class_name}-${cls.section}`} value={cls.class_name}>
                    Class {cls.class_name}
                  </option>
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
                {assignedClasses
                  .filter(cls => cls.class_name === selectedClass)
                  .map(cls => (
                    <option key={cls.section} value={cls.section}>
                      Section {cls.section}
                    </option>
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
                {assignedClasses.map(cls => (
                  <option key={`${cls.class_name}-${cls.section}`} value={cls.class_name}>
                    Class {cls.class_name}
                  </option>
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
                {assignedClasses
                  .filter(cls => cls.class_name === selectedClass)
                  .map(cls => (
                    <option key={cls.section} value={cls.section}>
                      Section {cls.section}
                    </option>
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
            
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Subject</label>
            <select
              value={marks.subjectId}
              onChange={(e) => setMarks((m) => ({ ...m, subjectId: e.target.value }))}
              style={{ width: '100%', marginBottom: 8, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            >
              <option value="">Select Subject</option>
              {assignedSubjects
                .filter(subject => {
                  // Show subjects that are assigned to the selected class
                  if (!selectedClass || !selectedSection) return true;
                  return teacherAssignments.some(assignment => 
                    assignment.class.class_name === selectedClass && 
                    assignment.class.section === selectedSection &&
                    assignment.subject.id === subject.id
                  );
                })
                .map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
            </select>
            
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

      {activeTab === 'assignments' && (
        <div style={{ padding: 20, backgroundColor: '#fff', border: '1px solid #ddd', borderTop: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>Assignment Management</h3>
            <button
              onClick={() => setShowAssignmentForm(!showAssignmentForm)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              {showAssignmentForm ? 'Cancel' : '+ Create Assignment'}
            </button>
          </div>

          {showAssignmentForm && (
            <div style={{ backgroundColor: '#f8f9fa', padding: 20, borderRadius: 4, marginBottom: 20 }}>
              <h4>Create New Assignment</h4>
              <form onSubmit={submitAssignment}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Title:</label>
                    <input
                      type="text"
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Type:</label>
                    <select
                      value={assignmentForm.assignment_type}
                      onChange={(e) => setAssignmentForm({...assignmentForm, assignment_type: e.target.value})}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    >
                      <option value="homework">Homework</option>
                      <option value="project">Project</option>
                      <option value="group_work">Group Work</option>
                      <option value="practice">Practice</option>
                      <option value="extra_credit">Extra Credit</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Description:</label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                    required
                    rows={3}
                    style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Class:</label>
                    <select
                      value={assignmentForm.class_id}
                      onChange={(e) => setAssignmentForm({...assignmentForm, class_id: e.target.value, subject_id: ''})}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.class_name} - {cls.section}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Subject:</label>
                    <select
                      value={assignmentForm.subject_id}
                      onChange={(e) => setAssignmentForm({...assignmentForm, subject_id: e.target.value})}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                      disabled={!assignmentForm.class_id}
                    >
                      <option value="">Select Subject</option>
                      {assignmentForm.class_id && classes.find(c => c.id == assignmentForm.class_id)?.Subjects?.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Due Date:</label>
                    <input
                      type="date"
                      value={assignmentForm.due_date}
                      onChange={(e) => setAssignmentForm({...assignmentForm, due_date: e.target.value, submission_deadline: e.target.value})}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Max Marks:</label>
                    <input
                      type="number"
                      value={assignmentForm.max_marks}
                      onChange={(e) => setAssignmentForm({...assignmentForm, max_marks: parseInt(e.target.value)})}
                      min="1"
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Status:</label>
                    <select
                      value={assignmentForm.status}
                      onChange={(e) => setAssignmentForm({...assignmentForm, status: e.target.value})}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 15 }}>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Instructions:</label>
                  <textarea
                    value={assignmentForm.instructions}
                    onChange={(e) => setAssignmentForm({...assignmentForm, instructions: e.target.value})}
                    rows={2}
                    style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    placeholder="Additional instructions for students..."
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <input
                      type="checkbox"
                      checked={assignmentForm.is_graded}
                      onChange={(e) => setAssignmentForm({...assignmentForm, is_graded: e.target.checked})}
                    />
                    Graded Assignment
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <input
                      type="checkbox"
                      checked={assignmentForm.allow_late_submission}
                      onChange={(e) => setAssignmentForm({...assignmentForm, allow_late_submission: e.target.checked})}
                    />
                    Allow Late Submission
                  </label>
                </div>

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
                  Create Assignment
                </button>
              </form>
            </div>
          )}

          <div>
            <h4>My Assignments</h4>
            {assignments.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No assignments created yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: 15 }}>
                {assignments.map(assignment => (
                  <div key={assignment.id} style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: 4, 
                    padding: 15,
                    backgroundColor: assignment.status === 'published' ? '#f8fff8' : '#fff8f8'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                      <div>
                        <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>{assignment.title}</h5>
                        <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '0.9em' }}>
                          {assignment.class?.class_name} - {assignment.subject?.name} | {assignment.assignment_type}
                        </p>
                        <p style={{ margin: 0, color: '#888', fontSize: '0.8em' }}>
                          Due: {new Date(assignment.due_date).toLocaleDateString()} | Max Marks: {assignment.max_marks}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: '0.8em',
                          backgroundColor: assignment.status === 'published' ? '#d4edda' : '#f8d7da',
                          color: assignment.status === 'published' ? '#155724' : '#721c24'
                        }}>
                          {assignment.status}
                        </span>
                        {assignment.status === 'draft' && (
                          <button
                            onClick={() => publishAssignment(assignment.id)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontSize: '0.8em',
                              cursor: 'pointer'
                            }}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAssignment(selectedAssignment?.id === assignment.id ? null : assignment)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: '0.8em',
                            cursor: 'pointer'
                          }}
                        >
                          {selectedAssignment?.id === assignment.id ? 'Hide' : 'View'} Submissions
                        </button>
                      </div>
                    </div>
                    
                    <p style={{ margin: '10px 0 5px 0', color: '#555', fontSize: '0.9em' }}>
                      {assignment.description}
                    </p>
                    
                    {assignment.submissions && assignment.submissions.length > 0 && (
                      <p style={{ margin: '5px 0 0 0', color: '#007bff', fontSize: '0.8em' }}>
                        📋 {assignment.submissions.length} submission(s) received
                      </p>
                    )}

                    {selectedAssignment?.id === assignment.id && assignment.submissions && (
                      <div style={{ marginTop: 15, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 4 }}>
                        <h6 style={{ margin: '0 0 10px 0' }}>Submissions:</h6>
                        {assignment.submissions.length === 0 ? (
                          <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No submissions yet.</p>
                        ) : (
                          assignment.submissions.map(submission => (
                            <div key={submission.id} style={{ 
                              border: '1px solid #ddd', 
                              borderRadius: 4, 
                              padding: 10, 
                              marginBottom: 10,
                              backgroundColor: 'white'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                  <strong>{submission.student?.name}</strong>
                                  <p style={{ margin: '2px 0', fontSize: '0.8em', color: '#666' }}>
                                    Submitted: {new Date(submission.submission_date).toLocaleString()}
                                    {submission.is_late && <span style={{ color: '#dc3545' }}> (Late)</span>}
                                  </p>
                                  {submission.submission_text && (
                                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}>{submission.submission_text}</p>
                                  )}
                                </div>
                                <span style={{
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  fontSize: '0.7em',
                                  backgroundColor: submission.status === 'graded' ? '#d4edda' : '#fff3cd',
                                  color: submission.status === 'graded' ? '#155724' : '#856404'
                                }}>
                                  {submission.status}
                                </span>
                              </div>
                              
                              {submission.status === 'submitted' && assignment.is_graded && (
                                <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                                  <input
                                    type="number"
                                    placeholder="Marks"
                                    max={assignment.max_marks}
                                    min="0"
                                    style={{ width: 80, padding: 4, border: '1px solid #ddd', borderRadius: 4 }}
                                    onBlur={(e) => {
                                      if (e.target.value) {
                                        const feedback = prompt('Enter feedback (optional):') || '';
                                        gradeSubmission(submission.id, parseInt(e.target.value), feedback);
                                      }
                                    }}
                                  />
                                  <span style={{ fontSize: '0.8em', color: '#666' }}>/ {assignment.max_marks}</span>
                                </div>
                              )}
                              
                              {submission.marks_obtained !== null && (
                                <div style={{ marginTop: 5, padding: 8, backgroundColor: '#e9f7ff', borderRadius: 4 }}>
                                  <strong>Grade: {submission.marks_obtained}/{assignment.max_marks}</strong>
                                  {submission.feedback && (
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8em' }}>
                                      Feedback: {submission.feedback}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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