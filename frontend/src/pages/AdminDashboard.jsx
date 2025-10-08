import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import AdminLandingPageManager from './AdminLandingPageManager.jsx';

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
  const [users, setUsers] = useState([]);
  
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

  // Teacher Assignment State
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classesAndSubjects, setClassesAndSubjects] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({
    teacher_id: '',
    class_id: '',
    subject_id: '',
    academic_year: new Date().getFullYear().toString()
  });

  // Attendance Management State
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    presentPercentage: 0
  });
  const [attendanceFilters, setAttendanceFilters] = useState({
    teacher_id: '',
    class_name: '',
    section: '',
    student_id: '',
    date_from: '',
    date_to: ''
  });
  const [students, setStudents] = useState([]);

  // Class and Subject Management State
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classForm, setClassForm] = useState({
    class_name: '',
    section: ''
  });
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    class_id: ''
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
      
      // Show success message instead of raw JSON
      setResult({
        success: true,
        message: `✅ ${res.data.user.role.charAt(0).toUpperCase() + res.data.user.role.slice(1)} "${res.data.user.name}" created successfully!`,
        user: res.data.user,
        student: res.data.student
      });
      
      // Clear form after successful creation
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'teacher',
        student: { class: '', section: '', parent_id: '' }
      });
      
      // Reload users list
      loadUsers();
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

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
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
      loadMealPlans();
      loadMealDashboard();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'classes') {
      loadClasses();
    } else if (activeTab === 'subjects') {
      loadSubjects();
      loadClasses(); // Load classes for the dropdown
    } else if (activeTab === 'teacher-assignments') {
      loadTeacherAssignments();
      loadTeachers();
      loadClassesAndSubjects();
    } else if (activeTab === 'attendance') {
      loadStudents();
      loadAttendanceData();
    }
  }, [activeTab]);

  // Teacher Assignment Functions
  const loadTeacherAssignments = async () => {
    try {
      const res = await api.get('/admin/teacher-assignments');
      setTeacherAssignments(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load teacher assignments');
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers');
      setTeachers(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load teachers');
    }
  };

  const loadClassesAndSubjects = async () => {
    try {
      const res = await api.get('/admin/classes-subjects');
      setClassesAndSubjects(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load classes and subjects');
    }
  };

  const submitTeacherAssignment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/admin/teacher-assignments', assignmentForm);
      setResult({
        success: true,
        message: `✅ Teacher assignment created successfully!`,
        assignment: res.data.assignment
      });
      setAssignmentForm({
        teacher_id: '',
        class_id: '',
        subject_id: '',
        academic_year: new Date().getFullYear().toString()
      });
      loadTeacherAssignments();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create teacher assignment');
    }
  };

  const deleteTeacherAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to remove this teacher assignment?')) {
      return;
    }
    try {
      const res = await api.delete(`/admin/teacher-assignments/${assignmentId}`);
      setResult({
        success: true,
        message: '✅ Teacher assignment removed successfully!'
      });
      loadTeacherAssignments();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to remove teacher assignment');
    }
  };

  // Class and Subject Management Functions
  const loadClasses = async () => {
    try {
      const res = await api.get('/admin/classes');
      setClasses(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load classes');
    }
  };

  const loadSubjects = async () => {
    try {
      const res = await api.get('/admin/subjects');
      setSubjects(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load subjects');
    }
  };

  const submitClass = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/admin/classes', classForm);
      setResult({
        success: true,
        message: `✅ Class "${res.data.class.class_name} - ${res.data.class.section}" created successfully!`,
        class: res.data.class
      });
      setClassForm({
        class_name: '',
        section: ''
      });
      loadClasses();
      loadClassesAndSubjects(); // Refresh the combined data for teacher assignments
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create class');
    }
  };

  const submitSubject = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/admin/subjects', subjectForm);
      setResult({
        success: true,
        message: `✅ Subject "${res.data.subject.name}" created successfully!`,
        subject: res.data.subject
      });
      setSubjectForm({
        name: '',
        class_id: ''
      });
      loadSubjects();
      loadClassesAndSubjects(); // Refresh the combined data for teacher assignments
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create subject');
    }
  };

  const deleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class? This will also remove all associated subjects and teacher assignments.')) {
      return;
    }
    try {
      const res = await api.delete(`/admin/classes/${classId}`);
      setResult({
        success: true,
        message: '✅ Class deleted successfully!'
      });
      loadClasses();
      loadClassesAndSubjects();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete class');
    }
  };

  const deleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject? This will also remove any teacher assignments for this subject.')) {
      return;
    }
    try {
      const res = await api.delete(`/admin/subjects/${subjectId}`);
      setResult({
        success: true,
        message: '✅ Subject deleted successfully!'
      });
      loadSubjects();
      loadClassesAndSubjects();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete subject');
    }
  };

  const onClassFormChange = (e) => {
    const { name, value } = e.target;
    setClassForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm(prev => ({ ...prev, [name]: value }));
  };

  const onAssignmentFormChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm(prev => ({ ...prev, [name]: value }));
  };

  // Attendance Management Functions
  const loadAttendanceData = async () => {
    setError('');
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(attendanceFilters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      const res = await api.get(`/admin/attendance?${queryParams.toString()}`);
      setAttendanceData(res.data.records || []);
      setAttendanceStats(res.data.stats || {
        total: 0,
        present: 0,
        absent: 0,
        presentPercentage: 0
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance data');
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get('/admin/users');
      const studentUsers = res.data.filter(user => user.role === 'student');
      setStudents(studentUsers);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const onAttendanceFilterChange = (e) => {
    const { name, value } = e.target;
    setAttendanceFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearAttendanceFilters = () => {
    setAttendanceFilters({
      teacher_id: '',
      class_name: '',
      section: '',
      student_id: '',
      date_from: '',
      date_to: ''
    });
    setAttendanceData([]);
    setAttendanceStats({
      total: 0,
      present: 0,
      absent: 0,
      presentPercentage: 0
    });
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Add styles for badges
  const badgeStyles = `
    .badge-success {
      background-color: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge-inactive {
      background-color: #6c757d;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
    }
  `;

  // Add the styles to the document head
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = badgeStyles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Admin Dashboard</h2>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: 24, borderBottom: '1px solid #ccc' }}>
        <button 
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'users' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'users' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('scholarships')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'scholarships' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'scholarships' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          Scholarship Management
        </button>
        <button 
          onClick={() => setActiveTab('meals')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'meals' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'meals' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          🍽️ Meals
        </button>
        <button 
          onClick={() => setActiveTab('classes')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'classes' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'classes' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          📚 Classes
        </button>
        <button 
          onClick={() => setActiveTab('subjects')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'subjects' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'subjects' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          📖 Subjects
        </button>
        <button 
          onClick={() => setActiveTab('teacher-assignments')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'teacher-assignments' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'teacher-assignments' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          👨‍🏫 Teacher Assignments
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'attendance' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'attendance' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          📊 Attendance
        </button>
        <button 
          onClick={() => setActiveTab('landing-page')}
          style={{
            padding: '10px 20px',
            margin: '0 5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: activeTab === 'landing-page' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'landing-page' ? 'white' : '#000',
            cursor: 'pointer'
          }}
        >
          🏠 Landing Page
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h3>Create New User</h3>
          
          {/* Information Box */}
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            maxWidth: 500
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>📋 How User Creation Works:</h4>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li><strong>ID System:</strong> Each user gets an auto-generated ID number (not email)</li>
              <li><strong>Parents:</strong> Create parent users first</li>
              <li><strong>Students:</strong> Link to existing parents using the dropdown</li>
              <li><strong>Teachers/Admins:</strong> No additional linking required</li>
            </ul>
          </div>

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
                <label>Parent (Select from existing parents)</label>
                <select 
                  name="student.parent_id" 
                  value={form.student.parent_id} 
                  onChange={onChange} 
                  style={{ width: '100%', marginBottom: 8, padding: 8 }}
                >
                  <option value="">Select a parent...</option>
                  {users.filter(user => user.role === 'parent').map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} (ID: {parent.id}) - {parent.email}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.8em', color: '#666', marginBottom: 8 }}>
                  💡 If parent doesn't exist, create the parent user first, then create the student.
                </div>
              </div>
            )}

            <button type="submit">Create User</button>
          </form>

          {/* Existing Users List */}
          <div style={{ marginTop: 32 }}>
            <h3>📋 Existing Users</h3>
            <div style={{ maxWidth: 800 }}>
              {users.length === 0 ? (
                <div style={{ padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, color: '#666' }}>
                  No users found. Create some users above!
                </div>
              ) : (
                <div>
                  {['admin', 'parent', 'teacher', 'student'].map(role => {
                    const roleUsers = users.filter(user => user.role === role);
                    if (roleUsers.length === 0) return null;
                    
                    return (
                      <div key={role} style={{ marginBottom: 24 }}>
                        <h4 style={{ 
                          color: role === 'admin' ? '#dc3545' : 
                                 role === 'parent' ? '#28a745' : 
                                 role === 'teacher' ? '#007bff' : '#6f42c1',
                          marginBottom: 12 
                        }}>
                          {role === 'admin' ? '👑' : 
                           role === 'parent' ? '👨‍👩‍👧‍👦' : 
                           role === 'teacher' ? '👩‍🏫' : '👧👦'} {role.toUpperCase()}S ({roleUsers.length})
                        </h4>
                        <div style={{ display: 'grid', gap: 8 }}>
                          {roleUsers.map(user => (
                            <div key={user.id} style={{
                              padding: 12,
                              backgroundColor: '#fff',
                              border: '1px solid #e9ecef',
                              borderRadius: 8,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div>
                                <strong>{user.name}</strong>
                                <div style={{ fontSize: '0.9em', color: '#666' }}>
                                  📧 {user.email}
                                </div>
                              </div>
                              <div style={{
                                backgroundColor: '#e9ecef',
                                padding: '4px 8px',
                                borderRadius: 12,
                                fontSize: '0.8em',
                                fontFamily: 'monospace'
                              }}>
                                ID: {user.id}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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

      {activeTab === 'classes' && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px', 
          padding: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '25px', textAlign: 'center' }}>
            📚 Class Management
          </h3>

          {/* Class Creation Form */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '30px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ color: '#495057', marginBottom: '20px' }}>Create New Class</h4>
            <form onSubmit={submitClass} style={{ display: 'flex', gap: '15px', alignItems: 'end', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Class Name *
                </label>
                <input
                  type="text"
                  name="class_name"
                  value={classForm.class_name}
                  onChange={onClassFormChange}
                  placeholder="e.g., 1st, 2nd, 10th"
                  required
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Section *
                </label>
                <input
                  type="text"
                  name="section"
                  value={classForm.section}
                  onChange={onClassFormChange}
                  placeholder="e.g., A, B, C"
                  required
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Create Class
              </button>
            </form>
          </div>

          {/* Classes List */}
          <div>
            <h4 style={{ color: '#495057', marginBottom: '20px' }}>Existing Classes</h4>
            {!Array.isArray(classes) || classes.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                No classes found. Create your first class above.
              </p>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '20px' 
              }}>
                {classes.map(classItem => (
                  <div
                    key={classItem.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      padding: '20px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h5 style={{ color: '#2c3e50', margin: 0 }}>
                        {classItem.class_name} - {classItem.section}
                      </h5>
                      <button
                        onClick={() => deleteClass(classItem.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '14px' }}>
                      <strong>Subjects:</strong> {classItem.Subjects?.length || 0} subject(s)
                      {classItem.Subjects && classItem.Subjects.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          {classItem.Subjects.map(subject => (
                            <span
                              key={subject.id}
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#e9ecef',
                                color: '#495057',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                margin: '2px',
                                fontWeight: 'bold'
                              }}
                            >
                              {subject.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px', 
          padding: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '25px', textAlign: 'center' }}>
            📖 Subject Management
          </h3>

          {/* Subject Creation Form */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '30px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ color: '#495057', marginBottom: '20px' }}>Create New Subject</h4>
            <form onSubmit={submitSubject} style={{ display: 'flex', gap: '15px', alignItems: 'end', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Subject Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={subjectForm.name}
                  onChange={onSubjectFormChange}
                  placeholder="e.g., Mathematics, Science"
                  required
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                />
              </div>
              <div style={{ minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Class *
                </label>
                <select
                  name="class_id"
                  value={subjectForm.class_id}
                  onChange={onSubjectFormChange}
                  required
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                >
                  <option value="">Select a class</option>
                  {Array.isArray(classes) && classes.map(classItem => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.class_name} - {classItem.section}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Create Subject
              </button>
            </form>
            {classes.length === 0 && (
              <p style={{ marginTop: '10px', color: '#dc3545', fontSize: '14px' }}>
                ⚠️ Please create classes first before adding subjects.
              </p>
            )}
          </div>

          {/* Subjects List */}
          <div>
            <h4 style={{ color: '#495057', marginBottom: '20px' }}>Existing Subjects</h4>
            {!Array.isArray(subjects) || subjects.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                No subjects found. Create your first subject above.
              </p>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '20px' 
              }}>
                {subjects.map(subject => (
                  <div
                    key={subject.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      padding: '20px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h5 style={{ color: '#2c3e50', margin: 0 }}>
                        {subject.name}
                      </h5>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ color: '#6c757d', fontSize: '14px' }}>
                      <strong>Class:</strong> {subject.Class ? `${subject.Class.class_name} - ${subject.Class.section}` : 'No class assigned'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'teacher-assignments' && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px', 
          padding: '30px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '25px', textAlign: 'center' }}>
            👨‍🏫 Teacher Assignments Management
          </h3>
          
          {/* Teacher Assignment Form */}
          <form onSubmit={submitTeacherAssignment} style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px', 
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>
                  👨‍🏫 Teacher:
                </label>
                <select
                  name="teacher_id"
                  value={assignmentForm.teacher_id}
                  onChange={onAssignmentFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e8ed',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select Teacher</option>
                  {Array.isArray(teachers) && teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>
                  🏫 Class:
                </label>
                <select
                  name="class_id"
                  value={assignmentForm.class_id}
                  onChange={onAssignmentFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e8ed',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select Class</option>
                  {Array.isArray(classesAndSubjects) && classesAndSubjects.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      Class {cls.class_name} - Section {cls.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>
                  📚 Subject:
                </label>
                <select
                  name="subject_id"
                  value={assignmentForm.subject_id}
                  onChange={onAssignmentFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e8ed',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select Subject</option>
                  {assignmentForm.class_id && classesAndSubjects
                    .find(cls => cls.id === parseInt(assignmentForm.class_id))
                    ?.Subjects?.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>
                  📅 Academic Year:
                </label>
                <input
                  type="text"
                  name="academic_year"
                  value={assignmentForm.academic_year}
                  onChange={onAssignmentFormChange}
                  placeholder="e.g., 2025"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e8ed',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit"
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              ✅ Assign Teacher
            </button>
          </form>

          {/* Current Assignments */}
          <div>
            <h4 style={{ color: '#2c3e50', marginBottom: '20px' }}>
              📋 Current Teacher Assignments ({teacherAssignments.length})
            </h4>
            
            {teacherAssignments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6c757d',
                fontSize: '18px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🏫</div>
                <div>No teacher assignments found</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Create the first assignment using the form above
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {teacherAssignments.map(assignment => (
                  <div 
                    key={assignment.id}
                    style={{
                      border: '2px solid #e1e8ed',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: '#f8f9fa',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#007bff';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0,123,255,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e1e8ed';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          marginBottom: '8px'
                        }}>
                          👨‍🏫 {assignment.teacher?.name}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6c757d',
                          marginBottom: '4px'
                        }}>
                          📧 {assignment.teacher?.email}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTeacherAssignment(assignment.id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                        title="Remove Assignment"
                      >
                        🗑️ Remove
                      </button>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>
                          Class
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#495057' }}>
                          🏫 {assignment.class?.class_name}-{assignment.class?.section}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>
                          Subject
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#495057' }}>
                          📚 {assignment.subject?.name}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid #dee2e6',
                      fontSize: '12px',
                      color: '#6c757d'
                    }}>
                      <span>📅 Academic Year: {assignment.academic_year}</span>
                      <span className={assignment.is_active ? 'badge-success' : 'badge-inactive'}>
                        {assignment.is_active ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div>
          <h3>📊 Attendance Management</h3>
          
          {/* Attendance Filters */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Teacher</label>
              <select 
                name="teacher_id" 
                value={attendanceFilters.teacher_id} 
                onChange={onAttendanceFilterChange} 
                style={{ width: '100%', padding: 8, marginBottom: 8 }}
              >
                <option value="">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Class</label>
              <select 
                name="class_name" 
                value={attendanceFilters.class_name} 
                onChange={onAttendanceFilterChange} 
                style={{ width: '100%', padding: 8, marginBottom: 8 }}
              >
                <option value="">All Classes</option>
                {classesAndSubjects.map(cls => (
                  <option key={cls.id} value={cls.class_name}>
                    Class {cls.class_name} - Section {cls.section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Section</label>
              <input 
                name="section" 
                value={attendanceFilters.section} 
                onChange={onAttendanceFilterChange} 
                style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                placeholder="Enter section (e.g., A, B, C)"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Student ID</label>
              <input 
                name="student_id" 
                value={attendanceFilters.student_id} 
                onChange={onAttendanceFilterChange} 
                style={{ width: '100%', padding: 8, marginBottom: 8 }} 
                placeholder="Enter student ID"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Date From</label>
              <input 
                name="date_from" 
                type="date" 
                value={attendanceFilters.date_from} 
                onChange={onAttendanceFilterChange} 
                style={{ width: '100%', padding: 8, marginBottom: 8 }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Date To</label>
              <input 
                name="date_to" 
                type="date" 
                value={attendanceFilters.date_to} 
                onChange={onAttendanceFilterChange} 
                style={{ width: '100%', padding: 8, marginBottom: 8 }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <button 
              onClick={loadAttendanceData}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '16px',
                marginRight: 8
              }}
            >
              🔍 Search Attendance
            </button>
            <button 
              onClick={clearAttendanceFilters}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ❌ Clear Filters
            </button>
          </div>

          {/* Attendance Data Table */}
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: 8, 
            overflow: 'hidden', 
            backgroundColor: '#fff' 
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              backgroundColor: '#f8f9fa', 
              padding: '12px 16px', 
              fontWeight: 'bold', 
              borderBottom: '1px solid #ddd' 
            }}>
              <div style={{ textAlign: 'center' }}>Date</div>
              <div style={{ textAlign: 'center' }}>Student ID</div>
              <div style={{ textAlign: 'center' }}>Name</div>
              <div style={{ textAlign: 'center' }}>Status</div>
            </div>
            {attendanceData.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#666' }}>
                No attendance records found for the selected filters.
              </div>
            ) : (
              attendanceData.map(record => (
                <div key={record.id} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  padding: '12px 16px', 
                  borderBottom: '1px solid #ddd' 
                }}>
                  <div style={{ textAlign: 'center' }}>
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {record.student_id}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {record.student_name}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      fontSize: '0.8em',
                      backgroundColor: record.status === 'present' ? '#d4edda' : '#f8d7da',
                      color: record.status === 'present' ? '#155724' : '#721c24'
                    }}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Attendance Statistics */}
          <div style={{ 
            marginTop: 24, 
            padding: 16, 
            border: '1px solid #ddd', 
            borderRadius: 8, 
            backgroundColor: '#f8f9fa' 
          }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>Attendance Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div style={{ 
                padding: 12, 
                borderRadius: 8, 
                backgroundColor: '#fff', 
                border: '1px solid #e1e8ed' 
              }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
                  {attendanceStats.present}
                </div>
                <div style={{ color: '#666', fontSize: '0.9em' }}>
                  Present
                </div>
              </div>
              <div style={{ 
                padding: 12, 
                borderRadius: 8, 
                backgroundColor: '#fff', 
                border: '1px solid #e1e8ed' 
              }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#dc3545' }}>
                  {attendanceStats.absent}
                </div>
                <div style={{ color: '#666', fontSize: '0.9em' }}>
                  Absent
                </div>
              </div>
              <div style={{ 
                padding: 12, 
                borderRadius: 8, 
                backgroundColor: '#fff', 
                border: '1px solid #e1e8ed' 
              }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#007bff' }}>
                  {attendanceStats.total}
                </div>
                <div style={{ color: '#666', fontSize: '0.9em' }}>
                  Total Records
                </div>
              </div>
              <div style={{ 
                padding: 12, 
                borderRadius: 8, 
                backgroundColor: '#fff', 
                border: '1px solid #e1e8ed' 
              }}>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#17a2b8' }}>
                  {attendanceStats.presentPercentage.toFixed(2)}%
                </div>
                <div style={{ color: '#666', fontSize: '0.9em' }}>
                  Present Percentage
                </div>
              </div>
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
              {result.student && (
                <div style={{ marginTop: 8, fontSize: '0.9em' }}>
                  📚 Student Details: Class {result.student.class}, Section {result.student.section}
                  {result.student.parent_id && ` (Parent ID: ${result.student.parent_id})`}
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

      {activeTab === 'landing-page' && (
        <AdminLandingPageManager />
      )}
    </div>
  );
}