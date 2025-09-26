import React, { useState, useEffect } from 'react';
import api from '../api/api.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    student: { class: '', section: '', parent_id: '' }
  });
  const [scholarshipForm, setScholarshipForm] = useState({
    title: '',
    description: '',
    eligibility_criteria: '',
    scholarship_amount: '',
    currency: 'INR',
    benefits: '',
    required_documents: ['Academic Transcripts', 'Income Certificate'],
    application_deadline: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    department: '',
    application_start_date: '',
    max_applications: '',
    scholarship_type: 'merit',
    class_eligibility: []
  });
  const [scholarships, setScholarships] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Meal System State
  const [mealForm, setMealForm] = useState({
    date: new Date().toISOString().split('T')[0],
    meal_name: '',
    description: '',
    items: [''],
    nutritional_info: {
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      fiber: '',
      vitamins: ''
    },
    allergens: [''],
    meal_type: 'lunch',
    total_quantity_planned: '',
    cost_per_meal: '',
    special_notes: ''
  });
  const [mealPlans, setMealPlans] = useState([]);
  const [mealFeedbacks, setMealFeedbacks] = useState({});
  const [mealDashboard, setMealDashboard] = useState({
    todaysMeal: null,
    consumptionStats: {},
    lowStockItems: [],
    alertsCount: 0
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('student.')) {
      const key = name.split('.')[1];
      setForm((f) => ({ ...f, student: { ...f.student, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form };
      if (payload.role !== 'student') delete payload.student;
      const res = await api.post('/admin/users', payload);
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create user');
    }
  };

  const fetchScholarships = async () => {
    try {
      const res = await api.get('/admin/scholarships');
      setScholarships(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch scholarships');
    }
  };

  const submitScholarship = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...scholarshipForm,
        scholarship_amount: parseFloat(scholarshipForm.scholarship_amount) || 0,
        max_applications: scholarshipForm.max_applications ? parseInt(scholarshipForm.max_applications) : null,
        required_documents: Array.isArray(scholarshipForm.required_documents) 
          ? scholarshipForm.required_documents 
          : scholarshipForm.required_documents.split(',').map(doc => doc.trim()).filter(doc => doc),
        class_eligibility: scholarshipForm.class_eligibility.length > 0 
          ? scholarshipForm.class_eligibility 
          : null
      };

      const res = await api.post('/admin/scholarships', payload);
      setResult(res.data);
      setScholarshipForm({
        title: '',
        description: '',
        eligibility_criteria: '',
        scholarship_amount: '',
        currency: 'INR',
        benefits: '',
        required_documents: ['Academic Transcripts', 'Income Certificate'],
        application_deadline: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        department: '',
        application_start_date: '',
        max_applications: '',
        scholarship_type: 'merit',
        class_eligibility: []
      });
      fetchScholarships();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create scholarship');
    }
  };

  const toggleScholarshipStatus = async (scholarshipId, newStatus) => {
    try {
      const res = await api.patch(`/admin/scholarships/${scholarshipId}/status`, { status: newStatus });
      setResult(res.data);
      fetchScholarships();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update scholarship status');
    }
  };

  const onScholarshipChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'required_documents') {
      // Handle comma-separated string
      const docs = value.split(',').map(doc => doc.trim()).filter(doc => doc);
      setScholarshipForm(prev => ({ ...prev, required_documents: docs }));
    } else if (name === 'class_eligibility') {
      // Handle multi-select for classes
      const selectedClasses = Array.from(e.target.selectedOptions, option => option.value);
      setScholarshipForm(prev => ({ ...prev, class_eligibility: selectedClasses }));
    } else {
      setScholarshipForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const loadMealDashboard = async () => {
    try {
      const res = await api.get('/admin/meal-dashboard');
      setMealDashboard(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal dashboard');
    }
  };

  const loadMealPlans = async () => {
    try {
      const res = await api.get('/admin/meal-plans');
      setMealPlans(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal plans');
    }
  };

  const loadMealFeedback = async (mealPlanId) => {
    try {
      const res = await api.get(`/admin/meal-feedback/${mealPlanId}`);
      setMealFeedbacks(prev => ({
        ...prev,
        [mealPlanId]: res.data
      }));
    } catch (err) {
      console.error('Failed to load meal feedback:', err);
    }
  };

  const submitMealPlan = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...mealForm,
        items: mealForm.items.filter(item => item.trim() !== ''),
        allergens: mealForm.allergens.filter(allergen => allergen.trim() !== ''),
        total_quantity_planned: parseInt(mealForm.total_quantity_planned),
        cost_per_meal: parseFloat(mealForm.cost_per_meal)
      };
      
      const res = await api.post('/admin/meal-plans', payload);
      setResult(res.data);
      setMealForm({
        date: new Date().toISOString().split('T')[0],
        meal_name: '',
        description: '',
        items: [''],
        nutritional_info: {
          calories: '',
          protein: '',
          carbohydrates: '',
          fat: '',
          fiber: '',
          vitamins: ''
        },
        allergens: [''],
        meal_type: 'lunch',
        total_quantity_planned: '',
        cost_per_meal: '',
        special_notes: ''
      });
      loadMealPlans();
      loadMealDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create meal plan');
    }
  };

  const onMealFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nutritional_info.')) {
      const key = name.split('.')[1];
      setMealForm(prev => ({
        ...prev,
        nutritional_info: { ...prev.nutritional_info, [key]: value }
      }));
    } else {
      setMealForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const addMealItem = () => {
    setMealForm(prev => ({ ...prev, items: [...prev.items, ''] }));
  };

  const removeMealItem = (index) => {
    setMealForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateMealItem = (index, value) => {
    setMealForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }));
  };

  const addAllergen = () => {
    setMealForm(prev => ({ ...prev, allergens: [...prev.allergens, ''] }));
  };

  const removeAllergen = (index) => {
    setMealForm(prev => ({
      ...prev,
      allergens: prev.allergens.filter((_, i) => i !== index)
    }));
  };

  const updateAllergen = (index, value) => {
    setMealForm(prev => ({
      ...prev,
      allergens: prev.allergens.map((allergen, i) => i === index ? value : allergen)
    }));
  };

  useEffect(() => {
    if (activeTab === 'scholarships') {
      fetchScholarships();
    } else if (activeTab === 'meals') {
      loadMealDashboard();
      loadMealPlans();
    }
  }, [activeTab]);

  // Helper function to calculate days remaining
  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Admin Dashboard</h2>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: 24, borderBottom: '1px solid #ccc' }}>
        <button 
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            backgroundColor: activeTab === 'users' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'users' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('scholarships')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            backgroundColor: activeTab === 'scholarships' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'scholarships' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Scholarship Management
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
          🍽️ Meal System
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h3>Create New User</h3>
          <form onSubmit={submit} style={{ maxWidth: 500 }}>
            <label>Name</label>
            <input name="name" value={form.name} onChange={onChange} style={{ width: '100%', marginBottom: 8 }} />
            <label>Email</label>
            <input name="email" value={form.email} onChange={onChange} style={{ width: '100%', marginBottom: 8 }} />
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} style={{ width: '100%', marginBottom: 8 }} />
            <label>Role</label>
            <select name="role" value={form.role} onChange={onChange} style={{ width: '100%', marginBottom: 8 }}>
              <option value="teacher">teacher</option>
              <option value="parent">parent</option>
              <option value="student">student</option>
              <option value="admin">admin</option>
            </select>

            {form.role === 'student' && (
              <div style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
                <h4>Student Info</h4>
                <label>Class</label>
                <input name="student.class" value={form.student.class} onChange={onChange} style={{ width: '100%', marginBottom: 8 }} />
                <label>Section</label>
                <input name="student.section" value={form.student.section} onChange={onChange} style={{ width: '100%', marginBottom: 8 }} />
                <label>Parent ID</label>
                <input name="student.parent_id" value={form.student.parent_id} onChange={onChange} style={{ width: '100%', marginBottom: 8 }} />
              </div>
            )}

            <button type="submit">Create User</button>
          </form>
        </div>
      )}

      {activeTab === 'scholarships' && (
        <div>
          <h3>Create New Scholarship</h3>
          <form onSubmit={submitScholarship} style={{ maxWidth: 600, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Title *</label>
                <input 
                  name="title" 
                  value={scholarshipForm.title} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Scholarship Type</label>
                <select 
                  name="scholarship_type" 
                  value={scholarshipForm.scholarship_type} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }}
                >
                  <option value="merit">Merit Based</option>
                  <option value="need_based">Need Based</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts</option>
                  <option value="minority">Minority</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Description</label>
              <textarea 
                name="description" 
                value={scholarshipForm.description} 
                onChange={onScholarshipChange} 
                style={{ width: '100%', padding: 8, height: 80, marginBottom: 8 }} 
                placeholder="Brief description of the scholarship program..."
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Eligibility Criteria *</label>
              <textarea 
                name="eligibility_criteria" 
                value={scholarshipForm.eligibility_criteria} 
                onChange={onScholarshipChange} 
                style={{ width: '100%', padding: 8, height: 100, marginBottom: 8 }} 
                placeholder="Who can apply? Academic requirements, income criteria, etc..."
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Amount (₹) *</label>
                <input 
                  name="scholarship_amount" 
                  type="number" 
                  step="0.01" 
                  value={scholarshipForm.scholarship_amount} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                  placeholder="50000"
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Max Applications</label>
                <input 
                  name="max_applications" 
                  type="number" 
                  value={scholarshipForm.max_applications} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Benefits</label>
              <textarea 
                name="benefits" 
                value={scholarshipForm.benefits} 
                onChange={onScholarshipChange} 
                style={{ width: '100%', padding: 8, height: 60, marginBottom: 8 }} 
                placeholder="Additional benefits beyond monetary amount (books, accommodation, etc.)"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Required Documents (comma-separated) *</label>
              <input 
                name="required_documents" 
                value={scholarshipForm.required_documents.join(', ')} 
                onChange={onScholarshipChange} 
                style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                placeholder="Academic Transcripts, Income Certificate, Recommendation Letter"
                required 
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Class Eligibility (Hold Ctrl/Cmd to select multiple)</label>
              <select 
                name="class_eligibility" 
                multiple 
                value={scholarshipForm.class_eligibility} 
                onChange={onScholarshipChange} 
                style={{ width: '100%', padding: 8, height: 100, marginBottom: 8 }}
              >
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
              <small style={{ color: '#666' }}>Leave empty to allow all classes</small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Application Start Date</label>
                <input 
                  name="application_start_date" 
                  type="date" 
                  value={scholarshipForm.application_start_date} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Application Deadline *</label>
                <input 
                  name="application_deadline" 
                  type="date" 
                  value={scholarshipForm.application_deadline} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                  required 
                />
              </div>
            </div>

            <h4 style={{ marginBottom: 12, color: '#333' }}>Contact Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Contact Person *</label>
                <input 
                  name="contact_person" 
                  value={scholarshipForm.contact_person} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Contact Email *</label>
                <input 
                  name="contact_email" 
                  type="email" 
                  value={scholarshipForm.contact_email} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Contact Phone</label>
                <input 
                  name="contact_phone" 
                  value={scholarshipForm.contact_phone} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Department</label>
                <input 
                  name="department" 
                  value={scholarshipForm.department} 
                  onChange={onScholarshipChange} 
                  style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                  placeholder="Academic Affairs, Student Welfare, etc."
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Create Scholarship
            </button>
          </form>

          <h3>Existing Scholarships</h3>
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {scholarships.length === 0 ? (
              <p>No scholarships created yet.</p>
            ) : (
              scholarships.map(scholarship => {
                const daysRemaining = getDaysRemaining(scholarship.application_deadline);
                return (
                  <div key={scholarship.id} style={{
                    border: '1px solid #ddd',
                    padding: 16,
                    marginBottom: 12,
                    borderRadius: 8,
                    backgroundColor: scholarship.status === 'active' ? '#f8f9fa' : 
                                     scholarship.status === 'expired' ? '#ffeaa7' : '#e9ecef'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                          {scholarship.title}
                          <span style={{
                            marginLeft: 8,
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: '0.8em',
                            backgroundColor: scholarship.scholarship_type === 'merit' ? '#e3f2fd' :
                                           scholarship.scholarship_type === 'need_based' ? '#fff3e0' :
                                           scholarship.scholarship_type === 'sports' ? '#e8f5e8' : '#f3e5f5',
                            color: '#666'
                          }}>
                            {scholarship.scholarship_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </h4>
                        <div style={{ marginBottom: 8 }}>
                          <strong>💰 Amount:</strong> ₹{parseFloat(scholarship.scholarship_amount).toLocaleString('en-IN')}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>📅 Deadline:</strong> {new Date(scholarship.application_deadline).toLocaleDateString()} 
                          <span style={{ 
                            marginLeft: 8,
                            color: daysRemaining <= 7 ? '#dc3545' : daysRemaining <= 30 ? '#ffc107' : '#28a745',
                            fontWeight: 'bold'
                          }}>
                            ({daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'})
                          </span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>👤 Contact:</strong> {scholarship.contact_person} ({scholarship.contact_email})
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>🎯 Eligible Classes:</strong> {scholarship.class_eligibility && scholarship.class_eligibility.length > 0 ? 
                            scholarship.class_eligibility.map(c => `Class ${c}`).join(', ') : 'All Classes'}
                        </div>
                        <div>
                          <strong>Status:</strong> <span style={{
                            padding: '2px 6px',
                            borderRadius: 3,
                            fontSize: '0.8em',
                            backgroundColor: scholarship.status === 'active' ? '#d4edda' :
                                           scholarship.status === 'expired' ? '#ffeaa7' : '#e2e3e5',
                            color: scholarship.status === 'active' ? '#155724' :
                                   scholarship.status === 'expired' ? '#856404' : '#383d41'
                          }}>
                            {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {scholarship.status === 'active' && (
                          <button 
                            onClick={() => toggleScholarshipStatus(scholarship.id, 'inactive')}
                            style={{ 
                              padding: '4px 8px', 
                              backgroundColor: '#ffc107', 
                              color: '#000', 
                              border: 'none', 
                              borderRadius: 3, 
                              cursor: 'pointer',
                              fontSize: '0.8em'
                            }}
                          >
                            Deactivate
                          </button>
                        )}
                        {scholarship.status === 'inactive' && (
                          <button 
                            onClick={() => toggleScholarshipStatus(scholarship.id, 'active')}
                            style={{ 
                              padding: '4px 8px', 
                              backgroundColor: '#28a745', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: 3, 
                              cursor: 'pointer',
                              fontSize: '0.8em'
                            }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'meals' && (
        <div>
          {/* Meal Dashboard Overview */}
          <div style={{ marginBottom: 32 }}>
            <h3>🍽️ Meal System Dashboard</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ 
                padding: 16, 
                border: '1px solid #ddd', 
                borderRadius: 8, 
                backgroundColor: '#f8f9fa' 
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>📅 Today's Meal</h4>
                {mealDashboard.todaysMeal ? (
                  <div>
                    <strong>{mealDashboard.todaysMeal.meal_name}</strong>
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
                      Type: {mealDashboard.todaysMeal.meal_type}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666' }}>No meal planned for today</div>
                )}
              </div>
              
              <div style={{ 
                padding: 16, 
                border: '1px solid #ddd', 
                borderRadius: 8, 
                backgroundColor: '#f8f9fa' 
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#28a745' }}>📊 Today's Stats</h4>
                <div style={{ fontSize: '0.9em' }}>
                  <div>Meals Served: {mealDashboard.consumptionStats.totalServed || 0}</div>
                  <div>Consumed: {mealDashboard.consumptionStats.consumedCount || 0}</div>
                  <div>Not Consumed: {mealDashboard.consumptionStats.notConsumedCount || 0}</div>
                </div>
              </div>
              
              <div style={{ 
                padding: 16, 
                border: '1px solid #ddd', 
                borderRadius: 8, 
                backgroundColor: mealDashboard.alertsCount > 0 ? '#fff3cd' : '#f8f9fa'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: mealDashboard.alertsCount > 0 ? '#856404' : '#dc3545' }}>
                  🚨 Inventory Alerts
                </h4>
                <div style={{ fontSize: '0.9em' }}>
                  {mealDashboard.alertsCount > 0 ? (
                    <div>
                      <strong>{mealDashboard.alertsCount}</strong> low stock items
                      <div style={{ marginTop: 4 }}>
                        {mealDashboard.lowStockItems.slice(0, 3).map(item => (
                          <div key={item.id} style={{ fontSize: '0.8em', color: '#666' }}>
                            • {item.item_name}: {item.current_stock} {item.unit}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#28a745' }}>All items well stocked</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Create New Meal Plan */}
          <div style={{ marginBottom: 32 }}>
            <h3>➕ Create New Meal Plan</h3>
            <form onSubmit={submitMealPlan} style={{ 
              maxWidth: 800, 
              padding: 20, 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              backgroundColor: '#fff' 
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Meal Name *</label>
                  <input 
                    name="meal_name" 
                    value={mealForm.meal_name} 
                    onChange={onMealFormChange} 
                    style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} 
                    required 
                    placeholder="e.g. Vegetarian Thali"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Date *</label>
                  <input 
                    name="date" 
                    type="date" 
                    value={mealForm.date} 
                    onChange={onMealFormChange} 
                    style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Meal Type</label>
                  <select 
                    name="meal_type" 
                    value={mealForm.meal_type} 
                    onChange={onMealFormChange} 
                    style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snack">Snack</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Cost per Meal (₹) *</label>
                  <input 
                    name="cost_per_meal" 
                    type="number" 
                    step="0.01" 
                    value={mealForm.cost_per_meal} 
                    onChange={onMealFormChange} 
                    style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} 
                    required
                    placeholder="35.50"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Total Quantity Planned *</label>
                <input 
                  name="total_quantity_planned" 
                  type="number" 
                  value={mealForm.total_quantity_planned} 
                  onChange={onMealFormChange} 
                  style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} 
                  required
                  placeholder="250"
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Description</label>
                <textarea 
                  name="description" 
                  value={mealForm.description} 
                  onChange={onMealFormChange} 
                  style={{ width: '100%', padding: 8, height: 60, border: '1px solid #ccc', borderRadius: 4 }} 
                  placeholder="Brief description of the meal..."
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Meal Items</label>
                {mealForm.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input 
                      value={item}
                      onChange={(e) => updateMealItem(index, e.target.value)}
                      style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                      placeholder="e.g. Steamed Rice"
                    />
                    {mealForm.items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeMealItem(index)}
                        style={{ padding: 8, backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4 }}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addMealItem}
                  style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4 }}
                >
                  ➕ Add Item
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Nutritional Information</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <input 
                    name="nutritional_info.calories" 
                    type="number" 
                    value={mealForm.nutritional_info.calories} 
                    onChange={onMealFormChange} 
                    style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4 }} 
                    placeholder="Calories"
                  />
                  <input 
                    name="nutritional_info.protein" 
                    type="number" 
                    value={mealForm.nutritional_info.protein} 
                    onChange={onMealFormChange} 
                    style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4 }} 
                    placeholder="Protein (g)"
                  />
                  <input 
                    name="nutritional_info.carbohydrates" 
                    type="number" 
                    value={mealForm.nutritional_info.carbohydrates} 
                    onChange={onMealFormChange} 
                    style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4 }} 
                    placeholder="Carbs (g)"
                  />
                  <input 
                    name="nutritional_info.fat" 
                    type="number" 
                    value={mealForm.nutritional_info.fat} 
                    onChange={onMealFormChange} 
                    style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4 }} 
                    placeholder="Fat (g)"
                  />
                  <input 
                    name="nutritional_info.fiber" 
                    type="number" 
                    value={mealForm.nutritional_info.fiber} 
                    onChange={onMealFormChange} 
                    style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4 }} 
                    placeholder="Fiber (g)"
                  />
                  <input 
                    name="nutritional_info.vitamins" 
                    value={mealForm.nutritional_info.vitamins} 
                    onChange={onMealFormChange} 
                    style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4 }} 
                    placeholder="Vitamins"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Allergens</label>
                {mealForm.allergens.map((allergen, index) => (
                  <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input 
                      value={allergen}
                      onChange={(e) => updateAllergen(index, e.target.value)}
                      style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
                      placeholder="e.g. Gluten, Dairy"
                    />
                    {mealForm.allergens.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeAllergen(index)}
                        style={{ padding: 8, backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4 }}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addAllergen}
                  style={{ padding: '8px 16px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: 4 }}
                >
                  ⚠️ Add Allergen
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Special Notes</label>
                <textarea 
                  name="special_notes" 
                  value={mealForm.special_notes} 
                  onChange={onMealFormChange} 
                  style={{ width: '100%', padding: 8, height: 60, border: '1px solid #ccc', borderRadius: 4 }} 
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <button 
                type="submit" 
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ✨ Create Meal Plan
              </button>
            </form>
          </div>

          {/* Existing Meal Plans */}
          <div>
            <h3>📋 Existing Meal Plans</h3>
            <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 8 }}>
              {mealPlans.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
                  No meal plans created yet. Create your first meal plan above!
                </div>
              ) : (
                mealPlans.map(meal => (
                  <div key={meal.id} style={{
                    border: '1px solid #eee',
                    padding: 16,
                    margin: 8,
                    borderRadius: 8,
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                          🍽️ {meal.meal_name}
                          <span style={{
                            marginLeft: 8,
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: '0.8em',
                            backgroundColor: meal.meal_type === 'lunch' ? '#e3f2fd' :
                                           meal.meal_type === 'breakfast' ? '#fff3e0' :
                                           meal.meal_type === 'dinner' ? '#f3e5f5' : '#e8f5e8',
                            color: '#666'
                          }}>
                            {meal.meal_type.toUpperCase()}
                          </span>
                        </h4>
                        <div style={{ marginBottom: 8 }}>
                          <strong>📅 Date:</strong> {new Date(meal.date).toLocaleDateString()}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>👥 Quantity:</strong> {meal.total_quantity_planned} servings
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <strong>💰 Cost:</strong> ₹{parseFloat(meal.cost_per_meal).toLocaleString('en-IN')} per meal
                        </div>
                        {meal.items && meal.items.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            <strong>🥘 Items:</strong> {meal.items.join(', ')}
                          </div>
                        )}
                        {meal.nutritional_info && (
                          <div style={{ marginBottom: 8 }}>
                            <strong>📊 Nutrition:</strong> {meal.nutritional_info.calories} cal
                            {meal.nutritional_info.protein && `, ${meal.nutritional_info.protein}g protein`}
                            {meal.nutritional_info.carbohydrates && `, ${meal.nutritional_info.carbohydrates}g carbs`}
                          </div>
                        )}
                        {meal.allergens && meal.allergens.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            <strong>⚠️ Allergens:</strong> {meal.allergens.join(', ')}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 12,
                          fontSize: '0.8em',
                          backgroundColor: meal.status === 'planned' ? '#fff3cd' :
                                         meal.status === 'prepared' ? '#cff4fc' :
                                         meal.status === 'served' ? '#d1ecf1' : '#d4edda',
                          color: '#495057'
                        }}>
                          {meal.status?.toUpperCase() || 'PLANNED'}
                        </span>
                        <button
                          onClick={() => loadMealFeedback(meal.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: '0.8em',
                            cursor: 'pointer'
                          }}
                        >
                          📊 View Feedback
                        </button>
                      </div>
                    </div>

                    {/* Meal Feedback Section */}
                    {mealFeedbacks[meal.id] && (
                      <div style={{
                        marginTop: 16,
                        padding: 16,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 8,
                        border: '1px solid #e9ecef'
                      }}>
                        <h5 style={{ margin: '0 0 12px 0', color: '#495057' }}>📝 Parent & Student Feedback</h5>
                        
                        {/* Feedback Statistics */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                            <div style={{ textAlign: 'center', padding: 8, backgroundColor: '#fff', borderRadius: 4 }}>
                              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
                                {mealFeedbacks[meal.id].stats.averageRating.toFixed(1)}⭐
                              </div>
                              <div style={{ fontSize: '0.8em', color: '#666' }}>Average Rating</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: 8, backgroundColor: '#fff', borderRadius: 4 }}>
                              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#007bff' }}>
                                {mealFeedbacks[meal.id].stats.totalFeedbacks}
                              </div>
                              <div style={{ fontSize: '0.8em', color: '#666' }}>Total Reviews</div>
                            </div>
                          </div>
                        </div>

                        {/* Rating Distribution */}
                        <div style={{ marginBottom: 16 }}>
                          <strong style={{ fontSize: '0.9em', color: '#495057' }}>Rating Distribution:</strong>
                          <div style={{ marginTop: 8 }}>
                            {[5, 4, 3, 2, 1].map(rating => (
                              <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ width: '30px', fontSize: '0.8em' }}>{rating}⭐</span>
                                <div style={{
                                  flex: 1,
                                  height: '16px',
                                  backgroundColor: '#e9ecef',
                                  borderRadius: 8,
                                  marginRight: 8,
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    height: '100%',
                                    width: `${mealFeedbacks[meal.id].stats.totalFeedbacks > 0 ? 
                                      (mealFeedbacks[meal.id].stats.ratingDistribution[rating] / mealFeedbacks[meal.id].stats.totalFeedbacks) * 100 : 0}%`,
                                    backgroundColor: '#28a745',
                                    borderRadius: 8
                                  }}></div>
                                </div>
                                <span style={{ fontSize: '0.8em', color: '#666', width: '30px' }}>
                                  {mealFeedbacks[meal.id].stats.ratingDistribution[rating]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Individual Feedback Comments */}
                        {mealFeedbacks[meal.id].feedbacks.length > 0 && (
                          <div>
                            <strong style={{ fontSize: '0.9em', color: '#495057' }}>Recent Comments:</strong>
                            <div style={{ marginTop: 8, maxHeight: '200px', overflowY: 'auto' }}>
                              {mealFeedbacks[meal.id].feedbacks
                                .filter(feedback => feedback.feedback && feedback.feedback.trim())
                                .slice(0, 5)
                                .map((feedback, idx) => (
                                <div key={idx} style={{
                                  padding: 8,
                                  backgroundColor: '#fff',
                                  borderRadius: 4,
                                  marginBottom: 8,
                                  border: '1px solid #e9ecef'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '0.8em', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 'bold' }}>{feedback.rating}⭐</span>
                                        <span style={{ marginLeft: 8, color: '#666' }}>
                                          {feedback.feedbackType === 'parent' ? '👨‍👩‍👧‍👦 Parent' : '👧👦 Student'}
                                        </span>
                                      </div>
                                      <div style={{ fontSize: '0.9em' }}>{feedback.feedback}</div>
                                    </div>
                                    <div style={{ fontSize: '0.7em', color: '#999' }}>
                                      {new Date(feedback.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
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

      {result && (
        <pre style={{ background: '#f6f8fa', padding: 16, marginTop: 16, borderRadius: 4, fontSize: '0.9em' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}