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
        icon: '/assets/landingpage/student.png',
        fallbackIcon: '🎓',
        value: 2500,
        label: 'Student Strength',
        description: 'Bright minds learning and growing with us',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
      },
      {
        icon: '/assets/landingpage/teacher.png',
        fallbackIcon: '👩‍🏫',
        value: 150,
        label: 'Teacher Strength',
        description: 'Experienced educators dedicated to excellence',
        gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
      },
      {
        icon: '/assets/landingpage/classroom.png',
        fallbackIcon: '🏫',
        value: 45,
        label: 'Smart Classrooms',
        description: 'Modern technology-enabled learning spaces',
        gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
      },
      {
        icon: '/assets/landingpage/calendar.png',
        fallbackIcon: '📅',
        value: 25,
        label: 'Years of Excellence',
        description: 'Serving the community since 1999 with dedication',
        gradient: 'linear-gradient(135deg, #ffd93d, #ff6b6b)'
      }
    ];

    if (!landingData?.stats || landingData.stats.length === 0) {
      return fallbackStats;
    }

    const processedData = landingData.stats.map(stat => ({
      icon: stat.icon,
      number: stat.value,  // Map 'value' from backend to 'number' for frontend
      label: stat.label,
      description: stat.description || `Excellence in ${stat.label.toLowerCase()}`,
      gradient: stat.gradient || 'linear-gradient(135deg, #667eea, #764ba2)'
    }));

    return processedData;
  }, [landingData]);

  // Helper function to get default staff icon (must be defined before processedStaffMembers)
  const getDefaultStaffIcon = (position) => {
    const lowerPosition = position.toLowerCase();
    if (lowerPosition.includes('principal')) return '👨‍💼';
    if (lowerPosition.includes('vice')) return '👩‍💼';
    if (lowerPosition.includes('academic') || lowerPosition.includes('director')) return '👨‍🎓';
    if (lowerPosition.includes('sports') || lowerPosition.includes('physical')) return '🏃‍♂️';
    if (lowerPosition.includes('science')) return '👩‍🔬';
    if (lowerPosition.includes('computer') || lowerPosition.includes('it')) return '👨‍💻';
    if (lowerPosition.includes('english') || lowerPosition.includes('language')) return '📚';
    if (lowerPosition.includes('art')) return '🎨';
    return '👨‍🏫';
  };



  // Process teacher data - Use backend teachers data if available, otherwise use fallback
  const processedStaffMembers = useMemo(() => {
    const fallbackTeachers = [
      {
        id: 1,
        name: 'PLN Phanikumar',
        position: 'Principal',
        qualification: 'Ph.D. in Education, M.Ed., B.Ed.',
        experience: '20+ Years',
        image: 'frontend/src/assets/teachers/PLN%20Phanikumar%20SA%20.png',
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
      }
    ];

    if (!landingData?.teachers || landingData.teachers.length === 0) {
      return fallbackTeachers;
    }

    return landingData.teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      position: teacher.position,
      qualification: teacher.qualifications,
      experience: teacher.experience || '10+ Years',
      image: teacher.photo ? `http://localhost:3001/uploads/teachers/${encodeURIComponent(teacher.photo)}` : getDefaultStaffIcon(teacher.position),
      email: teacher.email || `${teacher.name.toLowerCase().replace(/\s+/g, '.')}@excellenceschool.edu`,
      phone: teacher.phone || '+91-9876543210',
      isRealPhoto: !!teacher.photo
    }));
  }, [landingData]);

  // All hooks including useMemo MUST be at the top before any returns or conditional logic
  // Process data for rendering - using useMemo to optimize performance
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
      { id: 5, title: 'Community & Values', subtitle: 'Growing Together' }
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

  // Carousel auto-play effect - Fixed to avoid conditional dependencies
  useEffect(() => {
    if (loading || !landingData) {
      return; // Don't set up carousel until data is loaded
    }

    // Get carousel data dynamically
    const carouselData = landingData.carousel || [];
    const slides = carouselData.length > 0 ? carouselData : [
      { id: 1, title: `Welcome to ${landingData?.schoolInfo?.name || 'Excellence Public School'}`, subtitle: 'Nurturing Future Leaders' },
      { id: 2, title: 'Academic Excellence', subtitle: 'Shaping Bright Minds' },
      { id: 3, title: 'Sports & Activities', subtitle: 'Building Character' },
      { id: 4, title: 'Innovation & Technology', subtitle: 'Preparing for Tomorrow' },
      { id: 5, title: 'Community & Values', subtitle: 'Growing Together' }
    ];
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [loading, landingData]);

  // Counter animation effect - Fixed to avoid conditional dependencies
  useEffect(() => {
    if (loading) {
      return; // Don't animate until data is loaded
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

    // Trigger animation on component mount
    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, [loading]);

  const loadLandingPageData = async () => {
    try {
      const response = await api.get('/api/public/landing-page-data');
      setLandingData(response.data);
    } catch (error) {
      console.error('Error loading landing page data:', error);
      // Use fallback data if API fails
      setLandingData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data in case API fails
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

  // Auto-advance carousel
  useEffect(() => {
    if (carouselSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [carouselSlides.length]);

  const scrollAlbums = (direction) => {
    const albumsRow = document.getElementById('albumsRow');
    const scrollAmount = 340;
    
    if (direction === 'left') {
      albumsRow.scrollLeft -= scrollAmount;
    } else {
      albumsRow.scrollLeft += scrollAmount;
    }
  };

  const scrollStaff = (direction) => {
    const staffSlider = document.getElementById('staffSlider');
    const cardWidth = 340; // Width of one card + gap
    const scrollAmount = cardWidth * 3; // Scroll 3 cards at a time
    
    if (direction === 'left') {
      staffSlider.scrollLeft -= scrollAmount;
    } else {
      staffSlider.scrollLeft += scrollAmount;
    }
  };

  const scrollTeachers = (direction) => {
    const teachersRow = document.getElementById('teachersRow');
    const cardWidth = teachersRow.children[0]?.offsetWidth || 320; // Get actual card width
    const gap = 32; // 2rem gap between cards
    const totalCardWidth = cardWidth + gap;
    const visibleCards = 3; // Show 3 teachers at a time
    const scrollAmount = totalCardWidth * visibleCards;
    
    if (direction === 'left') {
      teachersRow.scrollLeft -= scrollAmount;
    } else {
      teachersRow.scrollLeft += scrollAmount;
    }
  };

  const filterAlbums = (category) => {
    setActiveFilter(category);
  };

  const toggleViewMore = () => {
    setViewMoreExpanded(!viewMoreExpanded);
  };

  const openAlbum = (albumId) => {
    navigate(`/album/${albumId}`);
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
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF' }}>{schoolInfo.name}</div>
              <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>School Landing Page</div>
            </div>
          </div>
          
          <div className="nav-actions">
            <button className="nav-btn" onClick={toggleSearch}>
              <img src="/src/assets/icons/search.png" alt="Search" />
            </button>
            
            <button className="nav-btn" onClick={toggleLanguage}>
              <img src="/src/assets/icons/translate.png" alt="Translate" />
            </button>

            <button 
              className="login-btn"
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginLeft: '10px',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'transparent';
              }}
            >
              <img 
                src="/src/assets/landingpage/loginicon.png" 
                alt="Login" 
                style={{ 
                  width: '40px', 
                  height: '40px'
                }} 
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="hero-section" id="home">
        <div className="carousel-container">
          {carouselSlides.map((slide, index) => {
            const imageUrl = slide.image 
              ? (slide.image.startsWith('http') 
                  ? slide.image 
                  : `http://localhost:3001${encodeURI(slide.image)}`)
              : undefined;
            
            const slideStyle = {
              backgroundImage: imageUrl ? `url("${imageUrl}")` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            };
            
            return (
              <div 
                key={`slide-${slide.id}`}
                className={`carousel-slide ${index === currentSlide ? 'active' : 'inactive'}`}
                style={slideStyle}
              >
                {/* Content overlay - only show if we have title or subtitle */}
                {(slide.title || slide.subtitle) && (
                  <div className="hero-content">
                    {slide.title && <h1>{slide.title}</h1>}
                    {slide.subtitle && <p>{slide.subtitle}</p>}
                  </div>
                )}
              </div>
            );
          })}
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

      {/* School Stats Section - Pride in Numbers */}
      <section className="achievements-section" id="achievements">
        <div className="container">
          <div className="pride-main-heading">
            <h1>Pride in Numbers</h1>
            <p>Our achievements and milestones that reflect our commitment to excellence</p>
          </div>
          
          <div className="section-title animate-on-scroll">
            <h2>Our Pride in Numbers</h2>
            <p>Excellence reflected through our achievements and the trust of our community</p>
          </div>

          <div className="stats-no-cards-grid">
            {processedStats.map((stat, index) => (
              <div key={index} className="stat-no-card-item">
                <div className="stat-no-card-icon">
                  <img src={stat.icon} alt={stat.label} />
                </div>
                <div className="stat-no-card-number" data-target={stat.number}>
                  {stat.number}
                </div>
                <div className="stat-no-card-label">{stat.label}</div>
                <div className="stat-no-card-description">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Details Section */}
      <section className="staff-section" id="staff">
        <div className="container">
          {/* Main Heading */}
          <div className="staff-main-title">
            <h1>Our Teaching Faculty</h1>
            <p>Meet the dedicated professionals shaping young minds</p>
          </div>
          
          <div className="section-title animate-on-scroll">
            <h2>Meet Our Leadership Team</h2>
            <p>Experienced educators and administrators committed to excellence</p>
          </div>

          <div className="teachers-container">
            <button className="teachers-nav prev" onClick={() => scrollTeachers('left')}>
              <img src="/src/assets/landingpage/left.png" alt="Previous" />
            </button>
            <div className="teachers-row" id="teachersRow">
              {processedStaffMembers.map((teacher) => (
                <div key={teacher.id} className="teacher-card">
                  {teacher.isRealPhoto ? (
                    <img src={teacher.image} alt={teacher.name} className="teacher-photo" />
                  ) : (
                    <div className="teacher-emoji">{teacher.image}</div>
                  )}
                  
                  <h3 className="teacher-name">{teacher.name}</h3>
                  <p className="teacher-position">{teacher.position}</p>
                  
                  <div className="teacher-details">
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-icon">
                        <img src="/src/assets/landingpage/education.png" alt="Education" />
                      </span>
                      <span>{teacher.qualification || 'Educational Background'}</span>
                    </div>
                    
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-icon">
                        <img src="/src/assets/landingpage/experience.png" alt="Experience" />
                      </span>
                      <span>{teacher.experience || 'Experience'}</span>
                    </div>
                    
                    <div className="teacher-detail-item">
                      <span className="teacher-detail-icon">
                        <img src="/src/assets/landingpage/phone.png" alt="Phone" />
                      </span>
                      <span>{teacher.phone || 'Contact'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="teachers-nav next" onClick={() => scrollTeachers('right')}>
              <img src="/src/assets/landingpage/right.png" alt="Next" />
            </button>
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
                    {album.coverImage ? (
                      <img 
                        src={album.coverImage.startsWith('http') 
                          ? album.coverImage 
                          : `http://localhost:3001${album.coverImage}`
                        } 
                        alt={album.title}
                        className="album-cover-image"
                      />
                    ) : (
                      <span style={{ fontSize: '3rem' }}>{album.cover || '📷'}</span>
                    )}
                  </div>
                  <div className="album-info">
                    <div className="album-title">{album.title}</div>
                    <div className="album-description">{album.description}</div>
                    <div className="album-meta">
                      <span className="album-date">{new Date(album.date).toLocaleDateString()}</span>
                      <span className="album-photo-count">{album.images?.length || album.photoCount || 0} photos</span>
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

      {/* Footer Section */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content-single-row">
            {/* School Name - Absolute Left */}
            <div className="footer-left">
              <h2 className="footer-school-name">{schoolInfo.name || 'ZPHS Pendyala'}</h2>
            </div>
            
            {/* Copyright - Center */}
            <div className="footer-center">
              <p className="footer-copyright">
                © 2025 {schoolInfo.name || 'ZPHS Pendyala'}. All rights reserved.
              </p>
            </div>
            
            {/* Address - Right (3 layers like letter format) */}
            <div className="footer-right">
              <div className="footer-address-layers">
                <div className="address-line">Pendyala Village</div>
                <div className="address-line">Guntur District</div>
                <div className="address-line">Andhra Pradesh - 522019</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolLandingPage;
