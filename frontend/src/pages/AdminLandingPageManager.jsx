import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit2, Trash2, Save, X, Image, Users, BarChart3, Camera } from 'lucide-react';
import api from '../api/api.js';
import './AdminLandingPageManager.css';

const AdminLandingPageManager = () => {
  const [activeTab, setActiveTab] = useState('school-info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State for all sections
  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    logo: null,
    backgroundImage: null
  });
  
  const [stats, setStats] = useState([
    { label: 'Students', value: 0, icon: 'users' },
    { label: 'Teachers', value: 0, icon: 'users' },
    { label: 'Years of Excellence', value: 0, icon: 'award' },
    { label: 'Smart Classrooms', value: 0, icon: 'monitor' }
  ]);
  
  const [teachers, setTeachers] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [carousel, setCarousel] = useState([]);
  
  // Form states
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  
  // Album manager states
  const [showAlbumManager, setShowAlbumManager] = useState(false);
  const [managingAlbum, setManagingAlbum] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/landing-page');
      const data = response.data;
      setSchoolInfo(data.schoolInfo || {});
      setStats(data.stats || []);
      setTeachers(data.teachers || []);
      setAlbums(data.albums || []);
      setCarousel(data.carousel || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('error', 'Failed to load data');
    }
    setLoading(false);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // School Info Functions
  const handleSchoolInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', schoolInfo.name);
      formData.append('description', schoolInfo.description);
      formData.append('address', schoolInfo.address);
      formData.append('email', schoolInfo.email);
      formData.append('phone', schoolInfo.phone);
      
      if (schoolInfo.logo instanceof File) {
        formData.append('logo', schoolInfo.logo);
      }
      if (schoolInfo.backgroundImage instanceof File) {
        formData.append('backgroundImage', schoolInfo.backgroundImage);
      }
      
      const response = await api.post('/api/admin/school-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      showMessage('success', 'School information updated successfully');
      loadAllData();
    } catch (error) {
      console.error('Error updating school info:', error);
      showMessage('error', 'Failed to update school information');
    }
    setLoading(false);
  };

  // Stats Functions
  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.put('/api/admin/stats', { stats });
      showMessage('success', 'Statistics updated successfully');
    } catch (error) {
      console.error('Error updating stats:', error);
      showMessage('error', 'Failed to update statistics');
    }
    setLoading(false);
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = field === 'value' ? parseInt(value) || 0 : value;
    setStats(newStats);
  };

  // Teacher Functions
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    
    try {
      if (editingTeacher) {
        await api.put(`/api/admin/teachers/${editingTeacher.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Teacher updated successfully');
      } else {
        await api.post('/api/admin/teachers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Teacher added successfully');
      }
      
      setShowTeacherForm(false);
      setEditingTeacher(null);
      loadAllData();
    } catch (error) {
      console.error('Error with teacher:', error);
      showMessage('error', `Failed to ${editingTeacher ? 'update' : 'add'} teacher`);
    }
    setLoading(false);
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/admin/teachers/${id}`);
      showMessage('success', 'Teacher deleted successfully');
      loadAllData();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      showMessage('error', 'Failed to delete teacher');
    }
    setLoading(false);
  };

  // Album Functions
  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    
    try {
      if (editingAlbum) {
        await api.put(`/api/admin/albums/${editingAlbum.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Album updated successfully');
      } else {
        await api.post('/api/admin/albums', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Album added successfully');
      }
      
      setShowAlbumForm(false);
      setEditingAlbum(null);
      loadAllData();
    } catch (error) {
      console.error('Error with album:', error);
      showMessage('error', `Failed to ${editingAlbum ? 'update' : 'add'} album`);
    }
    setLoading(false);
  };

  const deleteAlbum = async (id) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/admin/albums/${id}`);
      showMessage('success', 'Album deleted successfully');
      loadAllData();
    } catch (error) {
      console.error('Error deleting album:', error);
      showMessage('error', 'Failed to delete album');
    }
    setLoading(false);
  };

  // Album manager functions
  const openAlbumManager = (album) => {
    setManagingAlbum(album);
    setShowAlbumManager(true);
  };

  const handleAlbumImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      await api.post(`/api/admin/albums/${managingAlbum.id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showMessage('success', `${files.length} images uploaded successfully`);
      loadAllData();
      // Refresh the managing album data
      const response = await api.get('/api/admin/landing-page');
      const updatedAlbum = response.data.albums.find(a => a.id === managingAlbum.id);
      setManagingAlbum(updatedAlbum);
    } catch (error) {
      console.error('Error uploading images:', error);
      showMessage('error', 'Failed to upload images');
    }
    setLoading(false);
  };

  const removeImageFromAlbum = async (imageUrl) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/admin/albums/${managingAlbum.id}/images`, {
        data: { imageUrl }
      });
      showMessage('success', 'Image removed successfully');
      loadAllData();
      // Refresh the managing album data
      const response = await api.get('/api/admin/landing-page');
      const updatedAlbum = response.data.albums.find(a => a.id === managingAlbum.id);
      setManagingAlbum(updatedAlbum);
    } catch (error) {
      console.error('Error removing image:', error);
      showMessage('error', 'Failed to remove image');
    }
    setLoading(false);
  };

  // Carousel Functions
  const handleCarouselSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    
    try {
      if (editingCarousel) {
        await api.put(`/api/admin/carousel/${editingCarousel.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Carousel item updated successfully');
      } else {
        await api.post('/api/admin/carousel', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMessage('success', 'Carousel item added successfully');
      }
      
      setShowCarouselForm(false);
      setEditingCarousel(null);
      loadAllData();
    } catch (error) {
      console.error('Error with carousel:', error);
      showMessage('error', `Failed to ${editingCarousel ? 'update' : 'add'} carousel item`);
    }
    setLoading(false);
  };

  const deleteCarouselItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this carousel item?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/admin/carousel/${id}`);
      showMessage('success', 'Carousel item deleted successfully');
      loadAllData();
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      showMessage('error', 'Failed to delete carousel item');
    }
    setLoading(false);
  };

  // File preview helper
  const getImagePreview = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file;
  };

  return (
    <div className="admin-landing-manager">
      <div className="manager-header">
        <h2>Landing Page Manager</h2>
        <p>Manage your school's public landing page content</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Card-based Layout like Parent Dashboard */}
      <div className="admin-cards-container">
        {/* School Info Card */}
        <div 
          className={`admin-card ${activeTab === 'school-info' ? 'active' : ''}`}
          onClick={() => setActiveTab('school-info')}
        >
          <div className="admin-card-icon">
            <Image size={48} />
          </div>
          <div className="admin-card-content">
            <h3>School Information</h3>
            <p>Manage basic school details and branding</p>
          </div>
        </div>

        {/* Statistics Card */}
        <div 
          className={`admin-card ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <div className="admin-card-icon">
            <BarChart3 size={48} />
          </div>
          <div className="admin-card-content">
            <h3>Statistics</h3>
            <p>Update pride in numbers section</p>
          </div>
        </div>

        {/* Teachers Card */}
        <div 
          className={`admin-card ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          <div className="admin-card-icon">
            <Users size={48} />
          </div>
          <div className="admin-card-content">
            <h3>Leadership Team</h3>
            <p>Manage teachers and staff profiles</p>
          </div>
        </div>

        {/* Albums Card */}
        <div 
          className={`admin-card ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          <div className="admin-card-icon">
            <Camera size={48} />
          </div>
          <div className="admin-card-content">
            <h3>Photo Albums</h3>
            <p>Manage school event galleries</p>
          </div>
        </div>

        {/* Carousel Card */}
        <div 
          className={`admin-card ${activeTab === 'carousel' ? 'active' : ''}`}
          onClick={() => setActiveTab('carousel')}
        >
          <div className="admin-card-icon">
            <Image size={48} />
          </div>
          <div className="admin-card-content">
            <h3>Hero Carousel</h3>
            <p>Manage homepage carousel images</p>
          </div>
        </div>
      </div>

      <div className="manager-content">
        {/* School Info Tab */}
        {activeTab === 'school-info' && (
          <div className="tab-content">
            <h3>School Information</h3>
            <form onSubmit={handleSchoolInfoSubmit} className="school-form">
              <div className="form-group">
                <label>School Name *</label>
                <input
                  type="text"
                  value={schoolInfo.name || ''}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                  required
                  placeholder="Enter school name"
                />
              </div>

              <div className="form-group">
                <label>School Description *</label>
                <textarea
                  value={schoolInfo.description || ''}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Enter school description"
                />
              </div>

              <div className="form-group">
                <label>School Address *</label>
                <input
                  type="text"
                  value={schoolInfo.address || ''}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                  required
                  placeholder="Enter school address"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={schoolInfo.email || ''}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                  required
                  placeholder="Enter school email address"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={schoolInfo.phone || ''}
                  onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                  required
                  placeholder="Enter school phone number"
                />
              </div>

              <div className="form-group">
                <label>School Logo</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, logo: e.target.files[0] })}
                  />
                  {schoolInfo.logo && (
                    <div className="image-preview">
                      <img src={getImagePreview(schoolInfo.logo)} alt="Logo preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Background Image</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, backgroundImage: e.target.files[0] })}
                  />
                  {schoolInfo.backgroundImage && (
                    <div className="image-preview">
                      <img src={getImagePreview(schoolInfo.backgroundImage)} alt="Background preview" />
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                <Save size={16} />
                {loading ? 'Saving...' : 'Save School Info'}
              </button>
            </form>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="tab-content">
            <h3>School Statistics</h3>
            <form onSubmit={handleStatsSubmit} className="stats-form">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Value</label>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Icon</label>
                    <select
                      value={stat.icon}
                      onChange={(e) => updateStat(index, 'icon', e.target.value)}
                    >
                      <option value="users">Users</option>
                      <option value="award">Award</option>
                      <option value="trophy">Trophy</option>
                      <option value="book">Book</option>
                      <option value="star">Star</option>
                    </select>
                  </div>
                </div>
              ))}
              <button type="submit" disabled={loading} className="submit-btn">
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Statistics'}
              </button>
            </form>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Leadership Team</h3>
              <button 
                onClick={() => setShowTeacherForm(true)} 
                className="add-btn"
              >
                <Plus size={16} />
                Add Teacher
              </button>
            </div>

            <div className="items-grid">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="item-card">
                  {teacher.photo && (
                    <img src={`/uploads/teachers/${teacher.photo}`} alt={teacher.name} className="item-image" />
                  )}
                  <div className="item-content">
                    <h4>{teacher.name}</h4>
                    <p className="position">{teacher.position}</p>
                    <p className="qualifications">{teacher.qualifications}</p>
                    {teacher.experience && <p className="experience">Experience: {teacher.experience}</p>}
                    {teacher.email && <p className="email">📧 {teacher.email}</p>}
                    {teacher.phone && <p className="phone">📞 {teacher.phone}</p>}
                  </div>
                  <div className="item-actions">
                    <button onClick={() => { setEditingTeacher(teacher); setShowTeacherForm(true); }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteTeacher(teacher.id)} className="delete-btn">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showTeacherForm && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</h3>
                    <button onClick={() => { setShowTeacherForm(false); setEditingTeacher(null); }}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleTeacherSubmit}>
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={editingTeacher?.name || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Position *</label>
                      <input
                        name="position"
                        type="text"
                        defaultValue={editingTeacher?.position || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Qualifications</label>
                      <input
                        name="qualifications"
                        type="text"
                        defaultValue={editingTeacher?.qualifications || ''}
                        placeholder="e.g., Ph.D. in Education, M.Ed., B.Ed."
                      />
                    </div>
                    <div className="form-group">
                      <label>Experience</label>
                      <input
                        name="experience"
                        type="text"
                        defaultValue={editingTeacher?.experience || ''}
                        placeholder="e.g., 20+ Years"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={editingTeacher?.email || ''}
                        placeholder="e.g., principal@excellenceschool.edu"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        name="phone"
                        type="tel"
                        defaultValue={editingTeacher?.phone || ''}
                        placeholder="e.g., +91-9876543210"
                      />
                    </div>
                    <div className="form-group">
                      <label>Photo</label>
                      <input name="photo" type="file" accept="image/*" />
                      {editingTeacher?.photo && (
                        <div className="current-image">
                          <small>Current photo: {editingTeacher.photo}</small>
                        </div>
                      )}
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={() => { setShowTeacherForm(false); setEditingTeacher(null); }}>
                        Cancel
                      </button>
                      <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Albums Tab */}
        {activeTab === 'albums' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Photo Albums</h3>
              <button onClick={() => setShowAlbumForm(true)} className="add-btn">
                <Plus size={16} />
                Add Album
              </button>
            </div>

            <div className="items-grid">
              {albums.map((album) => (
                <div key={album.id} className="item-card">
                  {album.coverImage && (
                    <img src={album.coverImage} alt={album.title} className="item-image" />
                  )}
                  <div className="item-content">
                    <h4>{album.title}</h4>
                    <p>{album.description}</p>
                    <div className="album-meta">
                      <span className="album-category">{album.category || 'General'}</span>
                      <span className="album-date">{album.date}</span>
                      <span className="album-photos">{album.photoCount || 0} photos</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => { setEditingAlbum(album); setShowAlbumForm(true); }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => openAlbumManager(album)} className="manage-btn">
                      📷 Manage Photos
                    </button>
                    <button onClick={() => deleteAlbum(album.id)} className="delete-btn">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAlbumForm && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>{editingAlbum ? 'Edit Album' : 'Add Album'}</h3>
                    <button onClick={() => { setShowAlbumForm(false); setEditingAlbum(null); }}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleAlbumSubmit}>
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        name="title"
                        type="text"
                        defaultValue={editingAlbum?.title || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        defaultValue={editingAlbum?.description || ''}
                        rows={3}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Category</label>
                        <select name="category" defaultValue={editingAlbum?.category || 'general'}>
                          <option value="general">General</option>
                          <option value="academic">Academic</option>
                          <option value="sports">Sports</option>
                          <option value="cultural">Cultural</option>
                          <option value="events">Events</option>
                          <option value="graduation">Graduation</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          name="date"
                          type="date"
                          defaultValue={editingAlbum?.date || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Cover Image</label>
                      <input name="coverImage" type="file" accept="image/*" />
                      {editingAlbum?.coverImage && (
                        <div className="current-image">
                          <img src={editingAlbum.coverImage} alt="Current cover" style={{width: '100px', height: '60px', objectFit: 'cover'}} />
                          <span>Current cover image</span>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Photos (Optional - you can upload multiple)</label>
                      <input name="photos" type="file" accept="image/*" multiple />
                      <small style={{color: '#666', fontSize: '12px'}}>
                        You can select multiple photos at once to add to this album
                      </small>
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={() => { setShowAlbumForm(false); setEditingAlbum(null); }}>
                        Cancel
                      </button>
                      <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showAlbumManager && managingAlbum && (
              <div className="modal-overlay">
                <div className="modal large-modal">
                  <div className="modal-header">
                    <h3>Manage Photos - {managingAlbum.title}</h3>
                    <button onClick={() => { setShowAlbumManager(false); setManagingAlbum(null); }}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="album-manager">
                    <div className="upload-section">
                      <h4>Upload New Photos</h4>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAlbumImagesUpload}
                        disabled={loading}
                      />
                      <p className="upload-info">
                        Select multiple images to upload. Images will be automatically optimized and stored in Cloudinary.
                      </p>
                    </div>
                    
                    <div className="current-images">
                      <h4>Current Photos ({managingAlbum.images?.length || 0})</h4>
                      <div className="images-grid">
                        {managingAlbum.images && managingAlbum.images.length > 0 ? (
                          managingAlbum.images.map((imageUrl, index) => (
                            <div key={index} className="image-item">
                              <img src={imageUrl} alt={`Album image ${index + 1}`} />
                              <button
                                className="remove-image-btn"
                                onClick={() => removeImageFromAlbum(imageUrl)}
                                disabled={loading}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="no-images">No images uploaded yet. Use the upload section above to add photos.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button onClick={() => { setShowAlbumManager(false); setManagingAlbum(null); }}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Carousel Tab */}
        {activeTab === 'carousel' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Hero Carousel Images</h3>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Manage carousel background images. Title and subtitle are no longer displayed on slides.
              </p>
              <button onClick={() => setShowCarouselForm(true)} className="add-btn">
                <Plus size={16} />
                Add Image
              </button>
            </div>

            <div className="items-grid">
              {carousel.map((slide) => (
                <div key={slide.id} className="item-card">
                  {slide.image && (
                    <img src={slide.image} alt={`Slide ${slide.id}`} className="item-image" />
                  )}
                  <div className="item-content">
                    <h4>Slide {slide.id}</h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {slide.title ? `Reference: ${slide.title}` : 'Background Image'}
                    </p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => { setEditingCarousel(slide); setShowCarouselForm(true); }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteCarouselItem(slide.id)} className="delete-btn">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showCarouselForm && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>{editingCarousel ? 'Edit Carousel Image' : 'Add Carousel Image'}</h3>
                    <button onClick={() => { setShowCarouselForm(false); setEditingCarousel(null); }}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleCarouselSubmit}>
                    <div className="form-group">
                      <label>Reference Title (Optional)</label>
                      <input
                        name="title"
                        type="text"
                        defaultValue={editingCarousel?.title || ''}
                        placeholder="For internal reference only (not displayed on site)"
                      />
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        This title is only for admin reference and won't be shown on the website.
                      </small>
                    </div>
                    <div className="form-group">
                      <label>Background Image *</label>
                      <input name="image" type="file" accept="image/*" required={!editingCarousel} />
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        Recommended size: 1920x1080 pixels or higher for best quality.
                      </small>
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={() => { setShowCarouselForm(false); setEditingCarousel(null); }}>
                        Cancel
                      </button>
                      <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLandingPageManager;