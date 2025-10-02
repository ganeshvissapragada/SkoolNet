import React, { useContext, useState, useEffect } from 'react';
import api from '../api/api.js';
import { AuthContext } from '../auth/AuthContext.jsx';

export default function StudentDashboard() {
  const { userId } = useContext(AuthContext);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [mealConsumption, setMealConsumption] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    submission_text: '',
    attachments: []
  });
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCard, setSelectedCard] = useState(null);
  const [error, setError] = useState('');

  const loadAttendance = async () => {
    setError('');
    try {
      const res = await api.get(`/student/attendance/${userId}`);
      setAttendance(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance');
    }
  };

  const loadMarks = async () => {
    setError('');
    try {
      const res = await api.get(`/student/marks/${userId}`);
      setMarks(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load marks');
    }
  };

  const loadScholarships = async () => {
    setError('');
    try {
      const res = await api.get('/student/scholarships');
      setScholarships(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load scholarships');
      setScholarships([]);
    }
  };

  const loadMealPlans = async () => {
    setError('');
    try {
      const res = await api.get('/student/daily-meal-plan');
      // Convert single object to array if needed
      if (res.data && typeof res.data === 'object') {
        setMealPlans(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setMealPlans([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal plans');
      setMealPlans([]);
    }
  };

  const loadMealConsumption = async () => {
    setError('');
    try {
      const res = await api.get(`/student/my-meal-consumption/${userId}`);
      setMealConsumption(res.data.consumptions || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal consumption');
      setMealConsumption([]);
    }
  };

  const loadAssignments = async () => {
    setError('');
    try {
      const res = await api.get('/student/assignments');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load assignments');
      setAssignments([]);
    }
  };

  const submitMealFeedback = async (mealPlanId, rating, comments) => {
    try {
      await api.post(`/student/meal-feedback/${userId}`, {
        mealPlanId: mealPlanId,
        rating,
        feedback: comments,
        aspects: {},
        isAnonymous: false
      });
      alert('Feedback submitted successfully!');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const submitAssignment = async (assignmentId) => {
    setError('');
    try {
      if (!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0) {
        alert('Please provide either text submission or attachments');
        return;
      }

      console.log('📝 Submitting assignment:', assignmentId);
      console.log('Form data:', submissionForm);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('submission_text', submissionForm.submission_text);
      
      // Add files to FormData
      submissionForm.attachments.forEach((file, index) => {
        console.log(`Adding file ${index}:`, file.name, file.size);
        formData.append('attachments', file);
      });

      console.log('Sending FormData to server...');

      const response = await api.post(`/student/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
          setUploadProgress(percentCompleted);
        }
      });
      
      console.log('✅ Assignment submitted successfully:', response.data);
      alert('Assignment submitted successfully!');
      setSubmissionForm({ submission_text: '', attachments: [] });
      setSelectedAssignment(null);
      setIsSubmissionModalOpen(false);
      setUploadProgress(0);
      loadAssignments(); // Refresh assignments
    } catch (err) {
      console.error('❌ Assignment submission error:', err);
      console.error('Error response:', err.response?.data);
      setError(err?.response?.data?.message || 'Failed to submit assignment');
    }
  };

  const viewAssignmentDetails = async (assignmentId) => {
    setError('');
    try {
      const res = await api.get(`/student/assignments/${assignmentId}`);
      setSelectedAssignment(res.data.assignment);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load assignment details');
    }
  };

  // File handling functions
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has unsupported format.`);
        return false;
      }
      
      return true;
    });

    setSubmissionForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeFile = (index) => {
    setSubmissionForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType === 'text/plain') return '📋';
    return '📎';
  };

  // Mobile-friendly styles
  const mobileStyles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      padding: 0,
      fontSize: '16px'
    },
    header: {
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '15px 20px',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '10px'
    },
    cardContainer: {
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      border: '1px solid #e1e8ed'
    },
    cardIcon: {
      fontSize: '48px',
      marginBottom: '15px',
      display: 'block'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#2c3e50'
    },
    cardDescription: {
      fontSize: '14px',
      color: '#7f8c8d',
      lineHeight: '1.4'
    },
    detailsContainer: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }
  };

  const cards = [
    {
      id: 'attendance',
      icon: '📚',
      title: 'My Attendance',
      description: 'View your daily attendance records and track your presence',
      color: '#3498db',
      loadData: loadAttendance
    },
    {
      id: 'marks',
      icon: '📊',
      title: 'My Marks',
      description: 'Check your exam scores, grades, and academic performance',
      color: '#e74c3c',
      loadData: loadMarks
    },
    {
      id: 'scholarships',
      icon: '🏆',
      title: 'Scholarships',
      description: 'Explore available scholarships and financial aid opportunities',
      color: '#f39c12',
      loadData: loadScholarships
    },
    {
      id: 'meals',
      icon: '🍽️',
      title: 'Daily Meals',
      description: 'View meal plans, nutrition info, and submit feedback',
      color: '#27ae60',
      loadData: () => {loadMealPlans(); loadMealConsumption();}
    },
    {
      id: 'assignments',
      icon: '📋',
      title: 'My Assignments',
      description: 'View and manage your assignments and submissions',
      color: '#8e44ad',
      loadData: loadAssignments
    }
  ];

  const renderDashboard = () => (
    <div style={mobileStyles.cardContainer}>
      {cards.map(card => (
        <div
          key={card.id}
          style={{
            ...mobileStyles.card,
            borderLeft: `5px solid ${card.color}`
          }}
          onClick={() => {
            setSelectedCard(card);
            setCurrentView(card.id);
            card.loadData();
          }}
        >
          <div style={{...mobileStyles.cardIcon, color: card.color}}>
            {card.icon}
          </div>
          <div style={mobileStyles.cardTitle}>
            {card.title}
          </div>
          <div style={mobileStyles.cardDescription}>
            {card.description}
          </div>
          <div style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: card.color,
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            View Details
          </div>
        </div>
      ))}
    </div>
  );

  const renderAttendanceDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📚 My Attendance Records
        </h3>
        
        {!attendance ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📚</div>
            <button
              onClick={loadAttendance}
              style={{
                padding: '15px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Load My Attendance
            </button>
          </div>
        ) : attendance.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div>No attendance records found</div>
          </div>
        ) : (
          <div>
            {attendance.map((record, index) => (
              <div key={record._id || index} style={{
                backgroundColor: record.status === 'Present' ? '#e8f5e8' : '#ffe8e8',
                border: `2px solid ${record.status === 'Present' ? '#27ae60' : '#e74c3c'}`,
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '5px'}}>
                    📅 {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div style={{color: '#7f8c8d'}}>
                    {new Date(record.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: record.status === 'Present' ? '#27ae60' : '#e74c3c'
                }}>
                  {record.status === 'Present' ? '✅ Present' : '❌ Absent'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMarksDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📊 My Marks & Grades
        </h3>
        
        {!marks ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📊</div>
            <button
              onClick={loadMarks}
              style={{
                padding: '15px 30px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Load My Marks
            </button>
          </div>
        ) : marks.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div>No marks records found</div>
          </div>
        ) : (
          <div>
            {marks.map((record, index) => {
              const percentage = ((record.marksObtained / record.totalMarks) * 100).toFixed(1);
              const grade = percentage >= 90 ? 'A+' : 
                           percentage >= 80 ? 'A' : 
                           percentage >= 70 ? 'B+' : 
                           percentage >= 60 ? 'B' : 
                           percentage >= 50 ? 'C' : 'F';
              const isGood = percentage >= 60;
              
              return (
                <div key={record._id || index} style={{
                  backgroundColor: isGood ? '#e8f5e8' : '#ffe8e8',
                  border: `2px solid ${isGood ? '#27ae60' : '#e74c3c'}`,
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <div style={{fontSize: '18px', fontWeight: 'bold'}}>
                      📚 Subject: {record.subjectId}
                    </div>
                    <div style={{
                      backgroundColor: isGood ? '#27ae60' : '#e74c3c',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontWeight: 'bold'
                    }}>
                      Grade: {grade}
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px'}}>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Marks Obtained</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: isGood ? '#27ae60' : '#e74c3c'}}>
                        {record.marksObtained}/{record.totalMarks}
                      </div>
                    </div>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Percentage</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: isGood ? '#27ae60' : '#e74c3c'}}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#7f8c8d'}}>
                    <div>Exam Type: {record.examType}</div>
                    <div>Date: {new Date(record.date).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderScholarshipsDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          🏆 Available Scholarships
        </h3>
        
        {!scholarships || scholarships.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🏆</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              No scholarships available at the moment
            </div>
            <button
              onClick={loadScholarships}
              style={{
                padding: '15px 30px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Check for Scholarships
            </button>
          </div>
        ) : (
          <div>
            {scholarships.map(scholarship => {
              const daysRemaining = Math.ceil((new Date(scholarship.application_deadline) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={scholarship.id} style={{
                  backgroundColor: '#fff',
                  border: '2px solid #f39c12',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#f39c12'}}>
                    🏆 {scholarship.title}
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Amount</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: '#27ae60'}}>
                        ₹{parseFloat(scholarship.scholarship_amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Application Deadline</div>
                      <div style={{fontWeight: 'bold', color: daysRemaining <= 7 ? '#e74c3c' : '#f39c12'}}>
                        {new Date(scholarship.application_deadline).toLocaleDateString()}
                      </div>
                      <div style={{fontSize: '12px', color: daysRemaining <= 7 ? '#e74c3c' : '#f39c12'}}>
                        {daysRemaining > 0 ? `⏳ ${daysRemaining} days left` : '❌ Deadline passed'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{marginBottom: '10px'}}>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>Eligibility Criteria</div>
                    <div style={{fontSize: '14px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                      {scholarship.eligibility_criteria}
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#7f8c8d'}}>
                    <div>Type: {scholarship.scholarship_type}</div>
                    <div>Contact: {scholarship.contact_email}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderMealsDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          🍽️ Daily Meal Plan
        </h3>
        
        {!mealPlans || mealPlans.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🍽️</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              No meal plan available for today
            </div>
            <button
              onClick={() => {loadMealPlans(); loadMealConsumption();}}
              style={{
                padding: '15px 30px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Load Meal Data
            </button>
          </div>
        ) : (
          <div>
            {Array.isArray(mealPlans) && mealPlans.map(plan => (
              <div key={plan.id} style={{
                backgroundColor: '#fff',
                border: '2px solid #27ae60',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: '#27ae60'}}>
                    🍽️ {plan.meal_name}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: '#d4edda',
                    color: '#155724'
                  }}>
                    Today's Menu
                  </div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Description</div>
                  <div>{plan.description}</div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Menu Items</div>
                  <div style={{fontSize: '14px'}}>
                    {plan.items.join(', ')}
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>Nutrition</div>
                    <div style={{fontSize: '12px'}}>
                      Calories: {plan.nutritional_info?.calories}<br/>
                      Protein: {plan.nutritional_info?.protein}g
                    </div>
                  </div>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>Allergens</div>
                    <div style={{fontSize: '12px'}}>
                      {plan.allergens?.length > 0 ? plan.allergens.join(', ') : 'None'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const rating = prompt('Rate this meal (1-5 stars):');
                    const comments = prompt('Any comments about the meal?');
                    if (rating && rating >= 1 && rating <= 5) {
                      submitMealFeedback(plan.id, parseInt(rating), comments || '');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ⭐ Rate This Meal
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAssignmentsDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📋 My Assignments
        </h3>
        
        {!assignments || assignments.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              No assignments found
            </div>
            <button
              onClick={loadAssignments}
              style={{
                padding: '15px 30px',
                backgroundColor: '#8e44ad',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Refresh Assignments
            </button>
          </div>
        ) : (
          <div>
            {assignments.map(assignment => (
              <div key={assignment.id} style={{
                backgroundColor: '#fff',
                border: '2px solid #8e44ad',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: '#8e44ad'}}>
                    📋 {assignment.title}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: '#d1c4e9',
                    color: '#6a5b8a'
                  }}>
                    {assignment.status}
                  </div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Description</div>
                  <div>{assignment.description}</div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Due Date</div>
                  <div style={{fontWeight: 'bold', color: '#c0392b'}}>
                    {new Date(assignment.due_date).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#7f8c8d'}}>
                  <div>Type: {assignment.type}</div>
                  <div>
                    <button
                      onClick={() => viewAssignmentDetails(assignment.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#8e44ad',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedAssignment && (
          <div style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            padding: '15px',
            marginTop: '15px',
            border: '1px solid #e1e8ed'
          }}>
            <h4 style={{color: '#2c3e50', marginBottom: '10px'}}>
              Assignment Details
            </h4>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Title</div>
              <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                {selectedAssignment.title}
              </div>
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Description</div>
              <div>{selectedAssignment.description}</div>
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Due Date</div>
              <div style={{fontWeight: 'bold', color: '#c0392b'}}>
                {new Date(selectedAssignment.due_date).toLocaleDateString()}
              </div>
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Attachments</div>
              <div>
                {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 ? (
                  <ul style={{paddingLeft: '20px', margin: 0}}>
                    {selectedAssignment.attachments.map((file, index) => (
                      <li key={index} style={{marginBottom: '5px'}}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" style={{color: '#3498db', textDecoration: 'underline'}}>
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{color: '#7f8c8d'}}>No attachments</div>
                )}
              </div>
            </div>
            
            {/* Submission Status */}
            {selectedAssignment.submission_status !== 'pending' && (
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: selectedAssignment.submission_status === 'submitted' ? '#d5f4e6' : '#ffeaa7',
                borderRadius: '8px',
                border: '1px solid ' + (selectedAssignment.submission_status === 'submitted' ? '#00b894' : '#fdcb6e')
              }}>
                <h5 style={{ 
                  margin: '0 0 8px 0', 
                  color: selectedAssignment.submission_status === 'submitted' ? '#00b894' : '#e17055',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {selectedAssignment.submission_status === 'submitted' ? '✅' : '🔄'} 
                  Assignment {selectedAssignment.submission_status === 'submitted' ? 'Submitted' : 'Resubmitted'}
                </h5>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#2c3e50' }}>
                  Submitted on: {selectedAssignment.submitted_at ? new Date(selectedAssignment.submitted_at).toLocaleString() : 'N/A'}
                </p>
                {selectedAssignment.is_late && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#e74c3c', fontWeight: 'bold' }}>
                    ⚠️ Late Submission
                  </p>
                )}
                {selectedAssignment.marks_obtained !== null && (
                  <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>
                    Grade: {selectedAssignment.marks_obtained}/{selectedAssignment.max_marks}
                  </p>
                )}
                {selectedAssignment.feedback && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>Teacher Feedback:</div>
                    <div style={{ fontSize: '14px', color: '#2c3e50', fontStyle: 'italic' }}>
                      "{selectedAssignment.feedback}"
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              {selectedAssignment.submission_status === 'pending' && (
                <button
                  onClick={() => setIsSubmissionModalOpen(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  📝 Submit Assignment
                </button>
              )}
              <button
                onClick={() => setSelectedAssignment(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={mobileStyles.container}>
      <div style={mobileStyles.header}>
        {currentView !== 'dashboard' && (
          <button 
            style={mobileStyles.backButton}
            onClick={() => {
              setCurrentView('dashboard');
              setSelectedCard(null);
              setError('');
            }}
          >
            ← Back to Dashboard
          </button>
        )}
        <h1 style={{ margin: 0, fontSize: '22px' }}>
          {currentView === 'dashboard' ? '🎓 Student Dashboard' : selectedCard?.title}
        </h1>
        <div style={{ width: '50px' }}></div> {/* Spacer for alignment */}
      </div>

      {error && (
        <div style={{
          margin: '20px',
          padding: '15px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33',
          textAlign: 'center'
        }}>
          Error: {error}
        </div>
      )}

      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'attendance' && renderAttendanceDetails()}
      {currentView === 'marks' && renderMarksDetails()}
      {currentView === 'scholarships' && renderScholarshipsDetails()}
      {currentView === 'meals' && renderMealsDetails()}
      {currentView === 'assignments' && renderAssignmentsDetails()}

      {/* Modern Assignment Submission Modal */}
      {isSubmissionModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #e1e8ed',
              paddingBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                📝 Submit Assignment
              </h3>
              <button
                onClick={() => {
                  setIsSubmissionModalOpen(false);
                  setSubmissionForm({ submission_text: '', attachments: [] });
                  setUploadProgress(0);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#7f8c8d',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#2c3e50', margin: '0 0 8px 0' }}>
                {selectedAssignment?.title}
              </h4>
              <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>
                Due: {selectedAssignment ? new Date(selectedAssignment.due_date).toLocaleDateString() : ''}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Assignment Text/Response:
              </label>
              <textarea
                value={submissionForm.submission_text}
                onChange={(e) => setSubmissionForm(prev => ({ ...prev, submission_text: e.target.value }))}
                placeholder="Enter your assignment response, solution, or any text submission..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3498db'}
                onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                📎 Attach Files:
              </label>
              
              {/* File Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? '#3498db' : '#bdc3c7'}`,
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                  backgroundColor: dragActive ? '#ecf0f1' : '#f8f9fa',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {dragActive ? '📁' : '📎'}
                </div>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  {dragActive ? 'Drop files here' : 'Click to select files or drag & drop'}
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '12px', 
                  color: '#7f8c8d' 
                }}>
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (Max 10MB each)
                </p>
                
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
              </div>

              {/* Selected Files List */}
              {submissionForm.attachments.length > 0 && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h5 style={{ 
                    margin: '0 0 12px 0', 
                    color: '#2c3e50',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    Selected Files ({submissionForm.attachments.length}):
                  </h5>
                  
                  {submissionForm.attachments.map((file, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      border: '1px solid #e1e8ed'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '18px', marginRight: '8px' }}>
                          {getFileIcon(file.type)}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {file.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#7f8c8d'
                          }}>
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '4px',
                          marginLeft: '8px'
                        }}
                        title="Remove file"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  backgroundColor: '#ecf0f1',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#3498db',
                    height: '100%',
                    width: `${uploadProgress}%`,
                    transition: 'width 0.3s',
                    borderRadius: '8px'
                  }} />
                </div>
                <p style={{
                  textAlign: 'center',
                  margin: '8px 0 0 0',
                  fontSize: '12px',
                  color: '#7f8c8d'
                }}>
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              borderTop: '1px solid #e1e8ed',
              paddingTop: '16px'
            }}>
              <button
                onClick={() => {
                  setIsSubmissionModalOpen(false);
                  setSubmissionForm({ submission_text: '', attachments: [] });
                  setUploadProgress(0);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => submitAssignment(selectedAssignment.id)}
                disabled={!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0) ? '#bdc3c7' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: (!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                🚀 Submit Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
