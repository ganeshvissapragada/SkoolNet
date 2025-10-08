import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import './SchoolLandingPage.css';

const SchoolLandingPage = () => {
  // All hooks must be at the top level and called in the same order every time
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMoreExpanded, setViewMoreExpanded] = useState(false);
  const [landingData, setLandingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Process stats data - Use backend stats data if available, otherwise use fallback
  const processedStats = useMemo(() => {
    const fallbackStats = [
      {
        icon: '/src/assets/landingpage/student.png',
        number: 2500,
        label: 'Student Strength',
        description: 'Bright minds learning and growing with us',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
      },
      {
        icon: '/src/assets/landingpage/teacher.png',
        number: 150,
        label: 'Teacher Strength',
        description: 'Experienced educators dedicated to excellence',
        gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
      },
      {
        icon: '/src/assets/landingpage/classroom.png',
        number: 45,
        label: 'Smart Classrooms',
        description: 'Modern technology-enabled learning spaces',
        gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
      },
      {
        icon: '/src/assets/landingpage/calendar.png',
        number: 25,
        label: 'Years of Excellence',
        description: 'Serving the community since 1999 with dedication',
        gradient: 'linear-gradient(135deg, #ffd93d, #ff6b6b)'
      }
    ];

    console.log('📈 Processing stats data...');
    console.log('🗂️ Landing data available:', !!landingData);
    console.log('📊 Stats from backend:', landingData?.stats);
    console.log('🎯 Fallback stats:', fallbackStats);

    if (!landingData?.stats || landingData.stats.length === 0) {
      console.log('🔄 Using fallback stats data');
      return fallbackStats;
    }

    const processedData = landingData.stats.map(stat => ({
      icon: stat.icon,
      number: stat.value,
      label: stat.label,
      description: stat.description || `Excellence in ${stat.label.toLowerCase()}`,
      gradient: stat.gradient || 'linear-gradient(135deg, #667eea, #764ba2)'
    }));

    console.log('✅ Processed stats data:', processedData);
    return processedData;
  }, [landingData]);

  // Process teacher data - Use backend teachers data if available, otherwise use fallback
  const processedStaffMembers = useMemo(() => {
    const fallbackTeachers = [
      {
        id: 1,
        name: 'PLN Phanikumar',
        position: 'Principal',
        qualification: 'Ph.D. in Education, M.Ed., B.Ed.',
        experience: '20+ Years',
        image: '/src/assets/teachers/PLN_Phanikumar_SA.png',
        email: 'principal@excellenceschool.edu',
        phone: '+91-9876543210',
        isRealPhoto: true
      },
      {
        id: 2,
        name: 'Mrs. Priya Sharma',
        position: 'Vice Principal',
        qualification: 'M.Ed., B.Ed., M.A. English',
        experience: '15+ Years',
        image: '👩‍💼',
        email: 'viceprincipal@excellenceschool.edu',
        phone: '+91-9876543211'
      },
      {
        id: 3,
        name: 'Prof. Suresh Mehta',
        position: 'Academic Director',
        qualification: 'M.Sc. Physics, B.Ed., Ph.D.',
        experience: '18+ Years',
        image: '👨‍🎓',
        email: 'academic@excellenceschool.edu',
        phone: '+91-9876543212'
      },
      {
        id: 4,
        name: 'Mr. Arjun Singh',
        position: 'Sports Director',
        qualification: 'M.P.Ed., B.P.Ed., Sports Coach',
        experience: '12+ Years',
        image: '🏃‍♂️',
        email: 'sports@excellenceschool.edu',
        phone: '+91-9876543213'
      },
      {
        id: 5,
        name: 'Mr. Vikash Patel',
        position: 'IT Head',
        qualification: 'B.Tech IT, M.Tech, Certified',
        experience: '10+ Years',
        image: '👨‍💻',
        email: 'it@excellenceschool.edu',
        phone: '+91-9876543214'
      },
      {
        id: 6,
        name: 'Dr. Anita Reddy',
        position: 'Science Head',
        qualification: 'Ph.D. Chemistry, M.Sc., B.Ed.',
        experience: '16+ Years',
        image: '👩‍🔬',
        email: 'science@excellenceschool.edu',
        phone: '+91-9876543215'
      }
    ];

    console.log('👥 Processing staff data...');
    console.log('🗂️ Landing data available:', !!landingData);
    console.log('👨‍🏫 Teachers from backend:', landingData?.teachers);

    if (!landingData?.teachers || landingData.teachers.length === 0) {
      console.log('🔄 Using fallback teachers data');
      return fallbackTeachers;
    }

    console.log('✅ Using backend teachers data');
    const processedData = landingData.teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      position: teacher.position,
      qualification: teacher.qualifications || 'Qualified Educator',
      experience: 'Experienced Professional',
      image: teacher.photo ? `http://localhost:3001${teacher.photo}` : '👨‍🏫',
      email: `${teacher.name.toLowerCase().replace(/\s+/g, '.')}@excellenceschool.edu`,
      phone: `+91-98765432${String(teacher.id).padStart(2, '0')}`,
      isRealPhoto: !!teacher.photo
    }));
    
    console.log('✅ Processed teacher data:', processedData);
    return processedData;
  }, [landingData]);

  // Process other data
  const schoolInfo = useMemo(() => {
    return landingData?.schoolInfo || {
      name: 'Excellence Public School',
      description: 'Nurturing Future Leaders',
      logo: null,
      backgroundImage: null
    };
  }, [landingData]);

  const carouselSlides = useMemo(() => {
    const carouselData = landingData?.carousel || [];
    if (carouselData.length > 0) {
      return carouselData;
    }
    
    return [
      { id: 1, title: `Welcome to ${schoolInfo?.name || 'Excellence Public School'}`, subtitle: 'Nurturing Future Leaders' },
      { id: 2, title: 'Academic Excellence', subtitle: 'Shaping Bright Minds' },
      { id: 3, title: 'Sports & Activities', subtitle: 'Building Character' },
      { id: 4, title: 'Innovation & Technology', subtitle: 'Preparing for Tomorrow' },
      { id: 5, title: 'Community & Values', subtitle: 'Growing Together' },
      { id: 6, title: 'Achievements & Success', subtitle: 'Celebrating Excellence' }
    ];
  }, [landingData, schoolInfo]);

  const albums = useMemo(() => {
    const albumsData = landingData?.albums || [];
    if (albumsData.length > 0) {
      return albumsData;
    }
    
    return [
      {
        id: 1,
        title: 'Annual Sports Day 2024',
        description: 'Athletic competitions, team spirit, and celebrations of physical excellence',
        category: 'sports',
        date: '2024-03-15',
        photoCount: 156,
        cover: '🏃‍♂️'
      },
      {
        id: 2,
        title: 'Science Exhibition 2024',
        description: 'Student innovations, experiments, and scientific discoveries showcase',
        category: 'academic',
        date: '2024-02-20',
        photoCount: 89,
        cover: '🔬'
      },
      {
        id: 3,
        title: 'Cultural Festival 2024',
        description: 'Traditional dances, music performances, and artistic expressions',
        category: 'cultural',
        date: '2024-01-10',
        photoCount: 234,
        cover: '🎭'
      },
      {
        id: 4,
        title: 'Graduation Ceremony 2024',
        description: 'Celebrating the achievements of our graduating class of 2024',
        category: 'graduation',
        date: '2024-04-05',
        photoCount: 178,
        cover: '🎓'
      },
      {
        id: 5,
        title: 'Mathematics Olympiad',
        description: 'Competitive mathematics and problem-solving excellence',
        category: 'academic',
        date: '2024-05-12',
        photoCount: 67,
        cover: '🧮'
      },
      {
        id: 6,
        title: 'Environmental Day',
        description: 'Tree plantation and environmental awareness activities',
        category: 'events',
        date: '2024-06-05',
        photoCount: 92,
        cover: '🌱'
      }
    ];
  }, [landingData]);

  const filteredAlbums = useMemo(() => {
    return albums.filter(album => 
      activeFilter === 'all' || album.category === activeFilter
    );
  }, [albums, activeFilter]);

  const visibleAlbums = useMemo(() => {
    return viewMoreExpanded ? filteredAlbums : filteredAlbums.slice(0, 3);
  }, [filteredAlbums, viewMoreExpanded]);

  // Load landing page data from backend
  useEffect(() => {
    loadLandingPageData();
  }, []);

  // Carousel auto-play effect
  useEffect(() => {
    if (loading || !landingData) {
      return;
    }

    const carouselData = landingData.carousel || [];
    const slides = carouselData.length > 0 ? carouselData : [
      { id: 1, title: `Welcome to ${landingData?.schoolInfo?.name || 'Excellence Public School'}`, subtitle: 'Nurturing Future Leaders' },
      { id: 2, title: 'Academic Excellence', subtitle: 'Shaping Bright Minds' },
      { id: 3, title: 'Sports & Activities', subtitle: 'Building Character' },
      { id: 4, title: 'Innovation & Technology', subtitle: 'Preparing for Tomorrow' },
      { id: 5, title: 'Community & Values', subtitle: 'Growing Together' },
      { id: 6, title: 'Achievements & Success', subtitle: 'Celebrating Excellence' }
    ];
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, landingData]);

  // Counter animation effect
  useEffect(() => {
    if (loading) {
      return;
    }

    const animateCounters = () => {
      const counters = document.querySelectorAll('.achievement-number[data-target]');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
      });
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, [loading]);

  const loadLandingPageData = async () => {
    try {
      console.log('🚀 Fetching landing page data from API...');
      const response = await api.get('/api/public/landing-page-data');
      console.log('✅ Landing page data received:', response.data);
      console.log('📊 Stats data:', response.data.stats);
      setLandingData(response.data);
    } catch (error) {
      console.error('❌ Error loading landing page data:', error);
      console.log('🔄 Using fallback data...');
      setLandingData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => ({
    schoolInfo: {
      name: 'Excellence Public School',
      description: 'Nurturing Future Leaders',
      logo: null,
      backgroundImage: null
    },
    stats: [
      { label: 'Happy Students', value: 2500, icon: 'users' },
      { label: 'Expert Teachers', value: 150, icon: 'users' },
      { label: 'Awards Won', value: 45, icon: 'award' },
      { label: 'Years of Excellence', value: 25, icon: 'trophy' }
    ],
    teachers: [],
    albums: [],
    carousel: []
  });

  // Event handlers
  const handleSlideChange = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const scrollAlbums = (direction) => {
    const albumsRow = document.getElementById('albumsRow');
    const scrollAmount = 340;
    
    if (direction === 'left') {
      albumsRow.scrollLeft -= scrollAmount;
    } else {
      albumsRow.scrollLeft += scrollAmount;
    }
  };

  const filterAlbums = (category) => {
    setActiveFilter(category);
  };

  const toggleViewMore = () => {
    setViewMoreExpanded(!viewMoreExpanded);
  };

  const openAlbum = (albumId) => {
    alert(`Opening album: ${albumId}\n\nThis would open a full-screen photo gallery with all images from this event album.\n\n(To be implemented with backend integration)`);
  };

  const openUploadModal = () => {
    alert('Upload Album Modal\n\nThis would open a form to:\n- Add album title and description\n- Select event category\n- Upload multiple photos\n- Set event date\n\n(To be implemented with backend integration)');
  };

  const toggleSearch = () => {
    alert('Search functionality to be implemented');
  };

  const toggleLanguage = () => {
    alert('Language translation to be implemented');
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="school-landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            {schoolInfo.logo ? (
              <img src={`http://localhost:3001${schoolInfo.logo}`} alt="School Logo" className="logo-icon" />
            ) : (
              <img src="frontend/src/assets/icons/school_icon.png" alt="School Logo" className="logo-icon" />
            )}
            <div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#374151' }}>{schoolInfo.name}</div>
              <div style={{ fontSize: '16px', color: 'rgba(55, 65, 81, 0.7)' }}>School Landing Page</div>
            </div>
          </div>
          
          <div className="nav-actions">
            <button className="nav-btn" onClick={toggleSearch}>
              <img src="frontend/src/assets/icons/search.png" alt="Search" />
            </button>
            
            <button className="nav-btn" onClick={toggleLanguage}>
              <img src="frontend/src/assets/icons/translate.png" alt="Translate" />
            </button>

            <button 
              className="login-btn"
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginLeft: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔐 Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="hero-section" id="home">
        <div className="carousel-container">
          {carouselSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`carousel-slide slide${index + 1} ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="carousel-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-indicators">
          {carouselSlides.map((_, index) => (
            <span 
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      </section>

      {/* School Stats Section */}
      <section className="achievements-section" id="achievements">
        <div className="container">
          <div className="section-title animate-on-scroll">
            <h2>Our Pride in Numbers</h2>
            <p>Excellence reflected through our achievements and the trust of our community</p>
          </div>
          
          {/* DEBUG: Show stats count */}
          <div style={{ padding: '1rem', background: 'yellow', color: 'black', margin: '1rem 0' }}>
            DEBUG: Stats Count: {processedStats?.length || 0}
            {processedStats?.map((stat, i) => (
              <div key={i}>{stat.label}: {stat.number}</div>
            ))}
          </div>

          <div className="achievement-stats-grid">
            {processedStats.map((stat, index) => (
              <div 
                key={index}
                className="achievement-stat-card animate-on-scroll" 
                style={{ background: stat.gradient }}
              >
                <div className="achievement-icon">
                  <img src={stat.icon} alt={stat.label} className="stat-icon-image" />
                </div>
                <div className="achievement-number" data-target={stat.number}>0</div>
                <div className="achievement-label">{stat.label}</div>
                <div className="achievement-description">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Details Section */}
      <section className="staff-section" id="staff">
        <div className="container">
          <div className="section-title animate-on-scroll">
            <h2>Meet Our Leadership Team</h2>
            <p>Experienced educators and administrators committed to excellence</p>
          </div>
          
          {/* DEBUG: Show staff count */}
          <div style={{ padding: '1rem', background: 'yellow', color: 'black', margin: '1rem 0' }}>
            DEBUG: Staff Members Count: {processedStaffMembers?.length || 0}
          </div>

          <div className="modern-staff-grid">
            {processedStaffMembers.map((staff) => (
              <div key={staff.id} className="modern-staff-card animate-on-scroll">
                <div className="staff-card-header">
                  <div className="staff-avatar">
                    {staff.isRealPhoto ? (
                      <img src={staff.image} alt={staff.name} className="staff-photo" />
                    ) : (
                      <div className="staff-emoji">{staff.image}</div>
                    )}
                  </div>
                  <div className="staff-online-indicator"></div>
                </div>
                
                <div className="staff-card-body">
                  <h3 className="staff-name">{staff.name}</h3>
                  <div className="staff-position">{staff.position}</div>
                  <div className="staff-qualification">{staff.qualification}</div>
                  
                  <div className="staff-actions">
                    <button className="staff-btn primary">
                      <span className="btn-icon">📧</span>
                      Contact
                    </button>
                    <button className="staff-btn secondary">
                      <span className="btn-icon">📞</span>
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Albums/Gallery Section */}
      <section className="albums-section" id="albums">
        <div className="container">
          <div className="achievements-header">
            <div className="section-title">
              <h2>School Events & Memories</h2>
              <p>Capturing the beautiful moments and achievements of our school community</p>
            </div>
            
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => filterAlbums('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'academic' ? 'active' : ''}`}
                onClick={() => filterAlbums('academic')}
              >
                Academic
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'sports' ? 'active' : ''}`}
                onClick={() => filterAlbums('sports')}
              >
                Sports
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'cultural' ? 'active' : ''}`}
                onClick={() => filterAlbums('cultural')}
              >
                Cultural
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'events' ? 'active' : ''}`}
                onClick={() => filterAlbums('events')}
              >
                Events
              </button>
            </div>
            
            <button className="upload-btn" onClick={openUploadModal}>
              📸 Upload Album
            </button>
          </div>

          <div className="albums-container">
            <button className="albums-nav prev" onClick={() => scrollAlbums('left')}>‹</button>
            <button className="albums-nav next" onClick={() => scrollAlbums('right')}>›</button>
            
            <div className="albums-row" id="albumsRow">
              {visibleAlbums.map((album) => (
                <div 
                  key={album.id} 
                  className="album-card"
                  data-category={album.category}
                  onClick={() => openAlbum(album.id)}
                >
                  <div className="album-cover">
                    <span style={{ fontSize: '3rem' }}>{album.cover}</span>
                  </div>
                  <div className="album-info">
                    <div className="album-title">{album.title}</div>
                    <div className="album-description">{album.description}</div>
                    <div className="album-meta">
                      <span className="album-date">{new Date(album.date).toLocaleDateString()}</span>
                      <span className="album-photo-count">{album.photoCount} photos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredAlbums.length > 3 && (
            <div className="view-more-section">
              <button 
                className="view-more-btn" 
                onClick={toggleViewMore}
                style={{
                  background: viewMoreExpanded 
                    ? 'linear-gradient(135deg, #059669, #065f46)' 
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                }}
              >
                <span>{viewMoreExpanded ? 'View Less Albums' : 'View More Albums'}</span>
                <span className="arrow">{viewMoreExpanded ? '↑' : '→'}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-showcase-section" id="achievements-showcase">
        <div className="container">
          <div className="section-title animate-on-scroll">
            <h2>Our Achievements & Recognition</h2>
            <p>Celebrating excellence in academics, sports, and community service</p>
          </div>

          <div className="achievements-grid">
            {(landingData?.achievements || []).map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-header">
                  <div className="achievement-icon">{achievement.icon || '🏆'}</div>
                  <div className="achievement-meta">
                    <span className="achievement-year">{achievement.year}</span>
                    <span className="achievement-category">{achievement.category}</span>
                  </div>
                </div>
                <div className="achievement-content">
                  <h3>{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  {achievement.rank && (
                    <div className="achievement-rank">
                      <span className="rank-badge">{achievement.rank}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {(!landingData?.achievements || landingData.achievements.length === 0) && (
              <div className="no-achievements">
                <div className="no-achievements-icon">🏆</div>
                <h3>No Achievements Added Yet</h3>
                <p>Achievements will appear here once added by the administrator.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{schoolInfo.name}</h3>
              <p>{schoolInfo.description}</p>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">📸</a>
                <a href="#" className="social-link">📺</a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#admissions">Admissions</a></li>
                <li><a href="#academics">Academics</a></li>
                <li><a href="#facilities">Facilities</a></li>
                <li><a href="#activities">Activities</a></li>
                <li><a href="#results">Results</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>Address:</strong><br />
                    123 Education Street, Knowledge City,<br />
                    Learning State - 560001, India
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong>Phone:</strong><br />
                    +91-80-12345678<br />
                    +91-80-87654321
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <strong>Email:</strong><br />
                    info@excellenceschool.edu<br />
                    admissions@excellenceschool.edu
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <div>
                    <strong>Office Hours:</strong><br />
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 2:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 {schoolInfo.name}. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolLandingPage;
