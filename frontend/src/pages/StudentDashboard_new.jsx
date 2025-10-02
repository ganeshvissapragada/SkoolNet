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
    </div>
  );
}
