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
  const [activeTab, setActiveTab] = useState('attendance');
  const [error, setError] = useState('');

  const loadAttendance = async () => {
    try {
      const res = await api.get(`/student/attendance/${userId}`);
      setAttendance(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance');
    }
  };

  const loadMarks = async () => {
    try {
      const res = await api.get(`/student/marks/${userId}`);
      setMarks(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load marks');
    }
  };

  const loadScholarships = async () => {
    try {
      const res = await api.get('/student/scholarships');
      setScholarships(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load scholarships');
    }
  };

  const loadMealPlans = async () => {
    try {
      const res = await api.get('/student/daily-meal-plan');
      setMealPlans(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal plans');
    }
  };

  const loadMealConsumption = async () => {
    try {
      const res = await api.get('/student/my-meal-consumption');
      // The API returns { student: {...}, consumptions: [...] }
      setMealConsumption(res.data.consumptions || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal consumption');
    }
  };

  const submitMealFeedback = async (mealPlanId, rating, comments) => {
    try {
      await api.post('/student/meal-feedback', {
        meal_plan_id: mealPlanId,
        student_id: userId,
        rating,
        comments
      });
      alert('Feedback submitted successfully!');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit feedback');
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
    if (activeTab === 'scholarships') {
      loadScholarships();
    } else if (activeTab === 'meals') {
      loadMealPlans();
      loadMealConsumption();
    }
  }, [activeTab]);

  // Load initial data on component mount
  useEffect(() => {
    if (activeTab === 'meals') {
      loadMealPlans();
      loadMealConsumption();
    }
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Student Dashboard</h2>
      
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
              <pre style={{ background: '#f6f8fa', padding: 16 }}>{JSON.stringify(attendance, null, 2)}</pre>
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
              <pre style={{ background: '#f6f8fa', padding: 16 }}>{JSON.stringify(marks, null, 2)}</pre>
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
            <button onClick={() => {loadMealPlans(); loadMealConsumption();}} style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}>
              Refresh Meal Data
            </button>
          </div>
          
          <h3>🍽️ Today's Meal Plan</h3>
          {mealPlans.length === 0 ? (
            <p>No meal plans available for today.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {mealPlans.map(plan => (
                <div key={plan.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, color: '#2c3e50' }}>{plan.meal_name}</h4>
                      <p style={{ margin: 0, color: '#666' }}>{new Date(plan.date).toLocaleDateString()}</p>
                    </div>
                    <span style={{
                      backgroundColor: (plan.status === 'served' || plan.status === 'completed') ? '#28a745' : '#ffc107',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: '12px'
                    }}>
                      {plan.status ? plan.status.charAt(0).toUpperCase() + plan.status.slice(1) : 'Planned'}
                    </span>
                  </div>
                  
                  <p style={{ marginBottom: 12 }}>{plan.description}</p>
                  
                  <div style={{ marginBottom: 12 }}>
                    <strong>🍽️ Menu Items:</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                      {plan.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 12 }}>
                    <div>
                      <strong>📊 Nutritional Info:</strong>
                      <div style={{ fontSize: '14px', marginTop: 4 }}>
                        <div>Calories: {plan.nutritional_info.calories}</div>
                        <div>Protein: {plan.nutritional_info.protein}g</div>
                        <div>Carbs: {plan.nutritional_info.carbohydrates}g</div>
                        <div>Fat: {plan.nutritional_info.fat}g</div>
                      </div>
                    </div>
                    <div>
                      <strong>⚠️ Allergens:</strong>
                      <div style={{ fontSize: '14px', marginTop: 4 }}>
                        {plan.allergens.length > 0 ? plan.allergens.join(', ') : 'None'}
                      </div>
                    </div>
                  </div>
                  
                  {plan.special_notes && (
                    <div style={{ backgroundColor: '#fff3cd', padding: 8, borderRadius: 4, marginBottom: 12 }}>
                      <strong>📝 Special Notes:</strong> {plan.special_notes}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const rating = prompt('Rate this meal (1-5 stars):');
                        const comments = prompt('Any comments about the meal?');
                        if (rating && rating >= 1 && rating <= 5) {
                          submitMealFeedback(plan.id, parseInt(rating), comments || '');
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      ⭐ Rate Meal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <h3 style={{ marginTop: 24 }}>📈 My Meal Consumption History</h3>
          {!mealConsumption || !Array.isArray(mealConsumption) || mealConsumption.length === 0 ? (
            <p>No meal consumption records found.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {mealConsumption.map(consumption => (
                <div key={consumption.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{consumption.meal_plan?.meal_name || 'Meal'}</strong>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {new Date(consumption.consumed_at).toLocaleDateString()} at{' '}
                        {new Date(consumption.consumed_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: consumption.status === 'consumed' ? '#28a745' : '#6c757d',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: '12px'
                    }}>
                      {consumption.status ? consumption.status.charAt(0).toUpperCase() + consumption.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                  {consumption.notes && (
                    <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
                      Notes: {consumption.notes}
                    </div>
                  )}
                </div>
              ))}
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