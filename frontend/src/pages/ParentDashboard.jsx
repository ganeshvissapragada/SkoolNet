import React, { useContext, useState, useEffect } from 'react';
import api from '../api/api.js';
import { AuthContext } from '../auth/AuthContext.jsx';

export default function ParentDashboard() {
  const { userId } = useContext(AuthContext);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [ptms, setPtms] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [error, setError] = useState('');

  const loadAttendance = async () => {
    try {
      const res = await api.get(`/parent/attendance/child/${userId}`);
      setAttendance(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance');
    }
  };

  const loadMarks = async () => {
    try {
      const res = await api.get(`/parent/marks/child/${userId}`);
      setMarks(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load marks');
    }
  };

  const loadPTMs = async () => {
    try {
      const res = await api.get('/parent/ptms');
      setPtms(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load PTMs');
    }
  };

  const confirmPTM = async (ptmId) => {
    try {
      const res = await api.put(`/parent/ptm/${ptmId}/confirm`);
      setPtms(prevPtms => 
        prevPtms.map(ptm => 
          ptm.id === ptmId ? { ...ptm, status: 'confirmed' } : ptm
        )
      );
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to confirm PTM');
    }
  };

  const loadScholarships = async () => {
    try {
      const res = await api.get('/parent/scholarships');
      setScholarships(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load scholarships');
    }
  };

  // Helper function to calculate days remaining
  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (activeTab === 'ptm') {
      loadPTMs();
    } else if (activeTab === 'scholarships') {
      loadScholarships();
    }
  }, [activeTab]);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Parent Dashboard</h2>
      
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
          onClick={() => setActiveTab('scholarships')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'scholarships' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'scholarships' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Scholarships
        </button>
      </div>

      {activeTab === 'attendance' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <button onClick={loadAttendance} style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Load Child Attendance
            </button>
          </div>
          {attendance && (
            <>
              <h3>Attendance Records</h3>
              {attendance.length === 0 ? (
                <p>No attendance records found.</p>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {attendance.map((record, index) => (
                    <div key={index} style={{
                      border: '1px solid #ddd',
                      padding: 12,
                      marginBottom: 8,
                      borderRadius: 4,
                      backgroundColor: record.status === 'Present' ? '#e7f5e7' : '#fde7e7'
                    }}>
                      <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}<br/>
                      <strong>Status:</strong> <span style={{
                        padding: '2px 6px',
                        borderRadius: 3,
                        fontSize: '0.9em',
                        backgroundColor: record.status === 'Present' ? '#28a745' : '#dc3545',
                        color: 'white'
                      }}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'marks' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <button onClick={loadMarks} style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Load Child Marks
            </button>
          </div>
          {marks && (
            <>
              <h3>Marks Records</h3>
              {marks.length === 0 ? (
                <p>No marks records found.</p>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {marks.map((record, index) => (
                    <div key={index} style={{
                      border: '1px solid #ddd',
                      padding: 12,
                      marginBottom: 8,
                      borderRadius: 4,
                      backgroundColor: '#fff'
                    }}>
                      <strong>Subject ID:</strong> {record.subjectId}<br/>
                      <strong>Marks:</strong> {record.marksObtained}/{record.totalMarks} 
                      <span style={{ 
                        marginLeft: 8,
                        color: (record.marksObtained / record.totalMarks) >= 0.6 ? '#28a745' : '#dc3545'
                      }}>
                        ({((record.marksObtained / record.totalMarks) * 100).toFixed(1)}%)
                      </span><br/>
                      <strong>Exam Type:</strong> {record.examType}<br/>
                      <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'ptm' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <button onClick={loadPTMs} style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Refresh Meetings
            </button>
          </div>
          
          <h3>Parent-Teacher Meetings</h3>
          {ptms.length === 0 ? (
            <p>No meetings scheduled.</p>
          ) : (
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              {ptms.map(meeting => (
                <div key={meeting.id} style={{
                  border: '1px solid #ddd',
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 8,
                  backgroundColor: meeting.status === 'confirmed' ? '#e7f5e7' : 
                                   meeting.status === 'completed' ? '#cce7ff' :
                                   meeting.status === 'cancelled' ? '#fde7e7' : '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                        Meeting with {meeting.teacher?.name}
                      </h4>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Student:</strong> {meeting.student?.name} (Class: {meeting.student?.class} {meeting.student?.section})
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Teacher Email:</strong> {meeting.teacher?.email}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>📅 Date:</strong> {new Date(meeting.meeting_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>🕐 Time:</strong> {meeting.meeting_time} ({meeting.duration} minutes)
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <strong>📝 Reason:</strong> {meeting.reason}
                      </div>
                      {meeting.agenda && (
                        <div style={{ marginBottom: 8 }}>
                          <strong>📋 Agenda:</strong> {meeting.agenda}
                        </div>
                      )}
                      {meeting.location && (
                        <div style={{ marginBottom: 8 }}>
                          <strong>📍 Location:</strong> {meeting.location}
                        </div>
                      )}
                      <div style={{ marginBottom: 8 }}>
                        <strong>Status:</strong> <span style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: '0.9em',
                          fontWeight: 'bold',
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
                      {meeting.notes && (
                        <div style={{ 
                          marginTop: 12,
                          padding: 8,
                          backgroundColor: '#f8f9fa',
                          borderRadius: 4,
                          fontSize: '0.9em'
                        }}>
                          <strong>Notes:</strong> {meeting.notes}
                        </div>
                      )}
                    </div>
                    <div style={{ marginLeft: 16 }}>
                      {meeting.status === 'scheduled' && (
                        <button 
                          onClick={() => confirmPTM(meeting.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.9em'
                          }}
                        >
                          ✓ Confirm
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ 
                    marginTop: 12, 
                    fontSize: '0.8em', 
                    color: '#666',
                    borderTop: '1px solid #eee',
                    paddingTop: 8
                  }}>
                    Scheduled on: {new Date(meeting.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'scholarships' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <button onClick={loadScholarships} style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Refresh Scholarships
            </button>
          </div>
          
          <h3>Available Scholarships for Your Child</h3>
          {scholarships.length === 0 ? (
            <p>No scholarships available at the moment.</p>
          ) : (
            <div style={{ maxHeight: 600, overflowY: 'auto' }}>
              {scholarships.map(scholarship => {
                const daysRemaining = getDaysRemaining(scholarship.application_deadline);
                return (
                  <div key={scholarship.id} style={{
                    border: '1px solid #ddd',
                    padding: 20,
                    marginBottom: 16,
                    borderRadius: 12,
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '1.3em' }}>
                        🏆 {scholarship.title}
                      </h4>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: '0.9em',
                        fontWeight: 'bold',
                        marginBottom: 12,
                        backgroundColor: scholarship.scholarship_type === 'merit' ? '#e3f2fd' :
                                       scholarship.scholarship_type === 'need_based' ? '#fff3e0' :
                                       scholarship.scholarship_type === 'sports' ? '#e8f5e8' : '#f3e5f5',
                        color: scholarship.scholarship_type === 'merit' ? '#1976d2' :
                               scholarship.scholarship_type === 'need_based' ? '#f57c00' :
                               scholarship.scholarship_type === 'sports' ? '#388e3c' : '#7b1fa2'
                      }}>
                        {scholarship.scholarship_type.replace('_', ' ').toUpperCase()} SCHOLARSHIP
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                      <div>
                        <div style={{ marginBottom: 12 }}>
                          <strong style={{ color: '#28a745', fontSize: '1.1em' }}>💰 Scholarship Amount</strong>
                          <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#28a745' }}>
                            ₹{parseFloat(scholarship.scholarship_amount).toLocaleString('en-IN')}
                          </div>
                          {scholarship.currency && (
                            <small style={{ color: '#666' }}>({scholarship.currency})</small>
                          )}
                        </div>

                        {scholarship.benefits && (
                          <div style={{ marginBottom: 12 }}>
                            <strong>🎁 Additional Benefits:</strong>
                            <div style={{ marginTop: 4, color: '#666' }}>{scholarship.benefits}</div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ marginBottom: 12 }}>
                          <strong style={{ color: daysRemaining <= 7 ? '#dc3545' : daysRemaining <= 30 ? '#ffc107' : '#28a745' }}>
                            ⏰ Application Deadline
                          </strong>
                          <div style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
                            {new Date(scholarship.application_deadline).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div style={{ 
                            fontSize: '0.9em',
                            fontWeight: 'bold',
                            color: daysRemaining <= 7 ? '#dc3545' : daysRemaining <= 30 ? '#ffc107' : '#28a745'
                          }}>
                            {daysRemaining > 0 ? `⏳ ${daysRemaining} days remaining` : '❌ Deadline passed'}
                          </div>
                        </div>

                        {scholarship.max_applications && (
                          <div style={{ marginBottom: 12 }}>
                            <strong>👥 Max Applications:</strong> {scholarship.max_applications}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <strong style={{ color: '#007bff' }}>🎯 Eligibility Criteria:</strong>
                      <div style={{ 
                        marginTop: 8, 
                        padding: 12, 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: 8,
                        borderLeft: '4px solid #007bff'
                      }}>
                        {scholarship.eligibility_criteria}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <strong>📋 Required Documents:</strong>
                      <div style={{ marginTop: 8 }}>
                        {scholarship.required_documents.map((doc, index) => (
                          <div key={index} style={{
                            display: 'inline-block',
                            margin: '4px 8px 4px 0',
                            padding: '4px 8px',
                            backgroundColor: '#e9ecef',
                            borderRadius: 4,
                            fontSize: '0.9em'
                          }}>
                            📄 {doc}
                          </div>
                        ))}
                      </div>
                    </div>

                    {scholarship.class_eligibility && scholarship.class_eligibility.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <strong>🎓 Eligible Classes:</strong>
                        <div style={{ marginTop: 4 }}>
                          {scholarship.class_eligibility.map(cls => (
                            <span key={cls} style={{
                              display: 'inline-block',
                              margin: '2px 4px',
                              padding: '2px 8px',
                              backgroundColor: '#d4edda',
                              color: '#155724',
                              borderRadius: 12,
                              fontSize: '0.8em'
                            }}>
                              Class {cls}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {scholarship.description && (
                      <div style={{ marginBottom: 16 }}>
                        <strong>📝 Description:</strong>
                        <div style={{ marginTop: 4, color: '#666', fontStyle: 'italic' }}>
                          {scholarship.description}
                        </div>
                      </div>
                    )}

                    <div style={{ 
                      borderTop: '1px solid #eee', 
                      paddingTop: 16, 
                      backgroundColor: '#f8f9fa',
                      margin: '16px -20px -20px -20px',
                      padding: '16px 20px',
                      borderRadius: '0 0 12px 12px'
                    }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>📞 Contact Information</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
                        <div>
                          <strong>👤 Contact Person:</strong> {scholarship.contact_person}
                        </div>
                        <div>
                          <strong>📧 Email:</strong> 
                          <a href={`mailto:${scholarship.contact_email}`} style={{ color: '#007bff', textDecoration: 'none', marginLeft: 4 }}>
                            {scholarship.contact_email}
                          </a>
                        </div>
                        {scholarship.contact_phone && (
                          <div>
                            <strong>📱 Phone:</strong> 
                            <a href={`tel:${scholarship.contact_phone}`} style={{ color: '#007bff', textDecoration: 'none', marginLeft: 4 }}>
                              {scholarship.contact_phone}
                            </a>
                          </div>
                        )}
                        {scholarship.department && (
                          <div>
                            <strong>🏢 Department:</strong> {scholarship.department}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
    </div>
  );
}