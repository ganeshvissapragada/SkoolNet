import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit2, Trash2, Save, X, Image, Users, BarChart3, Camera } from 'lucide-react';
import './AdminLandingPageManager.css';

const AdminLandingPageManager = () => {
  const [activeTab, setActiveTab] = useState('school-info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State for all sections
  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    description: '',
    logo: null,
    backgroundImage: null
  });
  
  const [stats, setStats] = useState([
    { label: 'Students', value: 0, icon: 'users' },
    { label: 'Teachers', value: 0, icon: 'users' },
    { label: 'Years of Excellence', value: 0, icon: 'award' },
    { label: 'Achievements', value: 0, icon: 'trophy' }
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

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/landing-page');
      if (response.ok) {
        const data = await response.json();
        setSchoolInfo(data.schoolInfo || {});
        setStats(data.stats || []);
        setTeachers(data.teachers || []);
        setAlbums(data.albums || []);
        setCarousel(data.carousel || []);
      }
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
      
      if (schoolInfo.logo instanceof File) {
        formData.append('logo', schoolInfo.logo);
      }
      if (schoolInfo.backgroundImage instanceof File) {
        formData.append('backgroundImage', schoolInfo.backgroundImage);
      }
      
      const response = await fetch('/api/admin/school-info', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        showMessage('success', 'School information updated successfully');
        loadAllData();
      } else {
        showMessage('error', 'Failed to update school information');
      }
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
      const response = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats })
      });
      
      if (response.ok) {
        showMessage('success', 'Statistics updated successfully');
      } else {
        showMessage('error', 'Failed to update statistics');
      }
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
      const url = editingTeacher 
        ? `/api/admin/teachers/${editingTeacher.id}`
        : '/api/admin/teachers';
      
      const response = await fetch(url, {
        method: editingTeacher ? 'PUT' : 'POST',
        body: formData
      });
      
      if (response.ok) {
        showMessage('success', `Teacher ${editingTeacher ? 'updated' : 'added'} successfully`);
        setShowTeacherForm(false);
        setEditingTeacher(null);
        loadAllData();
      } else {
        showMessage('error', `Failed to ${editingTeacher ? 'update' : 'add'} teacher`);
      }
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
      const response = await fetch(`/api/admin/teachers/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showMessage('success', 'Teacher deleted successfully');
        loadAllData();
      } else {
        showMessage('error', 'Failed to delete teacher');
      }
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
      const url = editingAlbum 
        ? `/api/admin/albums/${editingAlbum.id}`
        : '/api/admin/albums';
      
      const response = await fetch(url, {
        method: editingAlbum ? 'PUT' : 'POST',
        body: formData
      });
      
      if (response.ok) {
        showMessage('success', `Album ${editingAlbum ? 'updated' : 'added'} successfully`);
        setShowAlbumForm(false);
        setEditingAlbum(null);
        loadAllData();
      } else {
        showMessage('error', `Failed to ${editingAlbum ? 'update' : 'add'} album`);
      }
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
      const response = await fetch(`/api/admin/albums/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showMessage('success', 'Album deleted successfully');
        loadAllData();
      } else {
        showMessage('error', 'Failed to delete album');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      showMessage('error', 'Failed to delete album');
    }
    setLoading(false);
  };

  // Carousel Functions
  const handleCarouselSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    
    try {
      const url = editingCarousel 
        ? `/api/admin/carousel/${editingCarousel.id}`
        : '/api/admin/carousel';
      
      const response = await fetch(url, {
        method: editingCarousel ? 'PUT' : 'POST',
        body: formData
      });
      
      if (response.ok) {
        showMessage('success', `Carousel item ${editingCarousel ? 'updated' : 'added'} successfully`);
        setShowCarouselForm(false);
        setEditingCarousel(null);
        loadAllData();
      } else {
        showMessage('error', `Failed to ${editingCarousel ? 'update' : 'add'} carousel item`);
      }
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
      const response = await fetch(`/api/admin/carousel/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showMessage('success', 'Carousel item deleted successfully');
        loadAllData();
      } else {
        showMessage('error', 'Failed to delete carousel item');
      }
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

      <div className="manager-tabs">
        <button 
          className={activeTab === 'school-info' ? 'active' : ''}
          onClick={() => setActiveTab('school-info')}
        >
          <Image size={16} />
          School Info
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={16} />
          Statistics
        </button>
        <button 
          className={activeTab === 'teachers' ? 'active' : ''}
          onClick={() => setActiveTab('teachers')}
        >
          <Users size={16} />
          Leadership Team
        </button>
        <button 
          className={activeTab === 'albums' ? 'active' : ''}
          onClick={() => setActiveTab('albums')}
        >
          <Camera size={16} />
          Albums
        </button>
        <button 
          className={activeTab === 'carousel' ? 'active' : ''}
          onClick={() => setActiveTab('carousel')}
        >
          <Image size={16} />
          Hero Carousel
        </button>
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
                    <img src={teacher.photo} alt={teacher.name} className="item-image" />
                  )}
                  <div className="item-content">
                    <h4>{teacher.name}</h4>
                    <p>{teacher.position}</p>
                    <p>{teacher.qualifications}</p>
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
                      />
                    </div>
                    <div className="form-group">
                      <label>Photo</label>
                      <input name="photo" type="file" accept="image/*" />
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
                  </div>
                  <div className="item-actions">
                    <button onClick={() => { setEditingAlbum(album); setShowAlbumForm(true); }}>
                      <Edit2 size={14} />
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
                    <div className="form-group">
                      <label>Cover Image</label>
                      <input name="coverImage" type="file" accept="image/*" />
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
          </div>
        )}

        {/* Carousel Tab */}
        {activeTab === 'carousel' && (
          <div className="tab-content">
            <div className="section-header">
              <h3>Hero Carousel</h3>
              <button onClick={() => setShowCarouselForm(true)} className="add-btn">
                <Plus size={16} />
                Add Slide
              </button>
            </div>

            <div className="items-grid">
              {carousel.map((slide) => (
                <div key={slide.id} className="item-card">
                  {slide.image && (
                    <img src={slide.image} alt={slide.title} className="item-image" />
                  )}
                  <div className="item-content">
                    <h4>{slide.title}</h4>
                    <p>{slide.subtitle}</p>
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
                    <h3>{editingCarousel ? 'Edit Slide' : 'Add Slide'}</h3>
                    <button onClick={() => { setShowCarouselForm(false); setEditingCarousel(null); }}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleCarouselSubmit}>
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        name="title"
                        type="text"
                        defaultValue={editingCarousel?.title || ''}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Subtitle</label>
                      <input
                        name="subtitle"
                        type="text"
                        defaultValue={editingCarousel?.subtitle || ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>Image</label>
                      <input name="image" type="file" accept="image/*" />
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