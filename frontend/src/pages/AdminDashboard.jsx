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

  useEffect(() => {
    if (activeTab === 'scholarships') {
      fetchScholarships();
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
            border: 'none',
            backgroundColor: activeTab === 'scholarships' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'scholarships' ? 'white' : '#000',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Scholarship Management
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