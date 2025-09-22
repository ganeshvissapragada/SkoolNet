import React, { useState } from 'react';
import api from '../api/api.js';

export default function AdminDashboard() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    student: { class: '', section: '', parent_id: '' }
  });
  const [result, setResult] = useState(null);

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
    const payload = { ...form };
    if (payload.role !== 'student') delete payload.student;
    const res = await api.post('/admin/users', payload);
    setResult(res.data);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
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

      {result && (
        <pre style={{ background: '#f6f8fa', padding: 16, marginTop: 16 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}