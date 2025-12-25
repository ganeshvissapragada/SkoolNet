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

  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabs = () => (
    <div style={{ marginBottom: '20px', borderBottom: '1px solid #dee2e6' }}>
      <button 
        onClick={() => setActiveTab('dashboard')}
        style={{
          padding: '10px 20px',
          marginRight: '10px',
          border: 'none',
          backgroundColor: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa',
          color: activeTab === 'dashboard' ? 'white' : '#000',
          cursor: 'pointer',
          borderRadius: '4px 4px 0 0'
        }}
      >
        Dashboard
      </button>
      <button 
        onClick={() => setActiveTab('meals')}
        style={{
          padding: '10px 20px',
          marginRight: '10px',
          border: 'none',
          backgroundColor: activeTab === 'meals' ? '#007bff' : '#f8f9fa',
          color: activeTab === 'meals' ? 'white' : '#000',
          cursor: 'pointer',
          borderRadius: '4px 4px 0 0'
        }}
      >
        Meal System
      </button>
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
            }}
          >
            ← Back
          </button>
        )}
        <h1 style={{ margin: 0, fontSize: '24px' }}>Student Dashboard</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      {renderTabs()}

      {activeTab === 'dashboard' && renderDashboard()}

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
              Load My Attendance
            </button>
          </div>
          {attendance && (
            <>
              <h3>My Attendance Records</h3>
              {attendance.length === 0 ? (
                <p style={{ padding: 16, background: '#f8f9fa', borderRadius: 4, color: '#6c757d' }}>
                  No attendance records found.
                </p>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {attendance.map((record, index) => (
                    <div key={record._id || index} style={{
                      border: '1px solid #ddd',
                      padding: 12,
                      marginBottom: 8,
                      borderRadius: 4,
                      backgroundColor: record.status === 'Present' ? '#e7f5e7' : '#fde7e7'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}<br/>
                          <strong>Status:</strong> <span style={{
                            padding: '2px 6px',
                            borderRadius: 3,
                            fontSize: '0.85em',
                            backgroundColor: record.status === 'Present' ? '#d4edda' : '#f8d7da',
                            color: record.status === 'Present' ? '#155724' : '#721c24'
                          }}>
                            {record.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8em', color: '#6c757d' }}>
                          {record.status === 'Present' ? '✅' : '❌'}
                        </div>
                      </div>
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
              Load My Marks
            </button>
          </div>
          {marks && (
            <>
              <h3>My Marks Records</h3>
              {marks.length === 0 ? (
                <p style={{ padding: 16, background: '#f8f9fa', borderRadius: 4, color: '#6c757d' }}>
                  No marks records found.
                </p>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {marks.map((record, index) => {
                    const percentage = record.totalMarks > 0 ? ((record.marksObtained / record.totalMarks) * 100).toFixed(1) : 0;
                    const grade = percentage >= 90 ? 'A+' : 
                                  percentage >= 80 ? 'A' : 
                                  percentage >= 70 ? 'B+' : 
                                  percentage >= 60 ? 'B' : 
                                  percentage >= 50 ? 'C' : 'F';
                    
                    return (
                      <div key={record._id || index} style={{
                        border: '1px solid #ddd',
                        padding: 12,
                        marginBottom: 8,
                        borderRadius: 4,
                        backgroundColor: percentage >= 60 ? '#e7f5e7' : percentage >= 40 ? '#fff3cd' : '#fde7e7'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <strong>Subject ID:</strong> {record.subjectId}<br/>
                            <strong>Exam Type:</strong> {record.examType}<br/>
                            <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}<br/>
                            <strong>Score:</strong> {record.marksObtained}/{record.totalMarks}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              fontSize: '1.2em', 
                              fontWeight: 'bold',
                              color: percentage >= 60 ? '#155724' : percentage >= 40 ? '#856404' : '#721c24'
                            }}>
                              {percentage}%
                            </div>
                            <div style={{
                              padding: '2px 8px',
                              borderRadius: 3,
                              fontSize: '0.8em',
                              backgroundColor: percentage >= 60 ? '#d4edda' : percentage >= 40 ? '#fff3cd' : '#f8d7da',
                              color: percentage >= 60 ? '#155724' : percentage >= 40 ? '#856404' : '#721c24'
                            }}>
                              Grade: {grade}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
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
              Load Available Scholarships
            </button>
          </div>
          
          <h3>🏆 Available Scholarships for Me</h3>
          {scholarships.length === 0 ? (
            <p>No scholarships available for your class at the moment.</p>
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
                        🎓 {scholarship.title}
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
                          <strong style={{ color: '#28a745', fontSize: '1.1em' }}>💰 You Can Win</strong>
                          <div style={{ fontSize: '1.6em', fontWeight: 'bold', color: '#28a745' }}>
                            ₹{parseFloat(scholarship.scholarship_amount).toLocaleString('en-IN')}
                          </div>
                          {scholarship.benefits && (
                            <div style={{ marginTop: 8, fontSize: '0.9em', color: '#666' }}>
                              <strong>Plus:</strong> {scholarship.benefits}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div style={{ marginBottom: 12 }}>
                          <strong style={{ color: daysRemaining <= 7 ? '#dc3545' : daysRemaining <= 30 ? '#ffc107' : '#28a745' }}>
                            ⏰ Apply Before
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
                            fontSize: '1em',
                            fontWeight: 'bold',
                            color: daysRemaining <= 7 ? '#dc3545' : daysRemaining <= 30 ? '#ffc107' : '#28a745'
                          }}>
                            {daysRemaining > 0 ? `⏳ Only ${daysRemaining} days left!` : '❌ Deadline passed'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <strong style={{ color: '#007bff' }}>✅ Am I Eligible?</strong>
                      <div style={{ 
                        marginTop: 8, 
                        padding: 12, 
                        backgroundColor: '#e8f4f8', 
                        borderRadius: 8,
                        borderLeft: '4px solid #007bff'
                      }}>
                        {scholarship.eligibility_criteria}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <strong>📋 Documents I Need to Submit:</strong>
                      <div style={{ marginTop: 8 }}>
                        {scholarship.required_documents.map((doc, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '6px 0',
                            padding: '6px 0'
                          }}>
                            <span style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: '#28a745',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8em',
                              marginRight: 8,
                              fontWeight: 'bold'
                            }}>
                              {index + 1}
                            </span>
                            📄 {doc}
                          </div>
                        ))}
                      </div>
                    </div>

                    {scholarship.description && (
                      <div style={{ marginBottom: 16 }}>
                        <strong>📖 About This Scholarship:</strong>
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
                      <h5 style={{ margin: '0 0 12px 0', color: '#333' }}>📞 Need Help? Contact:</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                        <div>
                          <strong>👤 {scholarship.contact_person}</strong>
                        </div>
                        <div>
                          📧 <a href={`mailto:${scholarship.contact_email}?subject=Scholarship Inquiry - ${scholarship.title}`} 
                               style={{ color: '#007bff', textDecoration: 'none' }}>
                            {scholarship.contact_email}
                          </a>
                        </div>
                        {scholarship.contact_phone && (
                          <div>
                            📱 <a href={`tel:${scholarship.contact_phone}`} 
                                 style={{ color: '#007bff', textDecoration: 'none' }}>
                              {scholarship.contact_phone}
                            </a>
                          </div>
                        )}
                        {scholarship.department && (
                          <div>
                            🏢 {scholarship.department}
                          </div>
                        )}
                      </div>
                      
                      {daysRemaining > 0 && (
                        <div style={{
                          marginTop: 16,
                          padding: 12,
                          backgroundColor: '#d4edda',
                          border: '1px solid #c3e6cb',
                          borderRadius: 6,
                          color: '#155724'
                        }}>
                          <strong>💡 Pro Tip:</strong> Start preparing your documents now! Contact {scholarship.contact_person} if you have any questions about the application process.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'meals' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <button 
              onClick={() => {
                loadMealPlans();
                loadMealConsumption();
              }} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Load Meal Plans
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3>Today's Meal Plan</h3>
              {mealPlans.length === 0 ? (
                <p style={{ padding: 16, background: '#f8f9fa', borderRadius: 4, color: '#6c757d' }}>
                  No meal plans available for today.
                </p>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {mealPlans.map((meal, index) => (
                    <div key={meal.id || index} style={{
                      border: '1px solid #ddd',
                      padding: 12,
                      marginBottom: 8,
                      borderRadius: 4
                    }}>
                      <h4 style={{ margin: '0 0 8px 0' }}>{meal.mealType}</h4>
                      <p style={{ margin: '0 0 8px 0' }}>{meal.description}</p>
                      <div style={{ fontSize: '0.9em', color: '#666' }}>
                        <strong>Nutrition:</strong><br/>
                        Calories: {meal.nutritionalInfo?.calories || 'N/A'}<br/>
                        Protein: {meal.nutritionalInfo?.protein || 'N/A'}g
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3>My Meal Consumption</h3>
              {mealConsumption.length === 0 ? (
                <p style={{ padding: 16, background: '#f8f9fa', borderRadius: 4, color: '#6c757d' }}>
                  No meal consumption records found.
                </p>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {mealConsumption.map((record, index) => (
                    <div key={record.id || index} style={{
                      border: '1px solid #ddd',
                      padding: 12,
                      marginBottom: 8,
                      borderRadius: 4
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}<br/>
                          <strong>Meal:</strong> {record.mealType}<br/>
                          <strong>Consumed:</strong> {record.consumed ? '✅' : '❌'}
                        </div>
                        {record.consumed && (
                          <button
                            onClick={() => submitMealFeedback(record.mealPlanId, 5, 'Delicious!')}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: '0.9em'
                            }}
                          >
                            Rate Meal
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
    </div>
  );
}