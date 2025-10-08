import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SchoolLandingPage.css';

const SchoolLandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMoreExpanded, setViewMoreExpanded] = useState(false);

  // Carousel data
  const carouselSlides = [
    { id: 1, title: 'Welcome to Excellence Public School', subtitle: 'Nurturing Future Leaders' },
    { id: 2, title: 'Academic Excellence', subtitle: 'Shaping Bright Minds' },
    { id: 3, title: 'Sports & Activities', subtitle: 'Building Character' },
    { id: 4, title: 'Innovation & Technology', subtitle: 'Preparing for Tomorrow' },
    { id: 5, title: 'Community & Values', subtitle: 'Growing Together' },
    { id: 6, title: 'Achievements & Success', subtitle: 'Celebrating Excellence' }
  ];

  // Stats data
  const stats = [
    {
      icon: '👥',
      number: 2500,
      label: 'Happy Students',
      description: 'Active learners from diverse backgrounds pursuing excellence',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      icon: '👨‍🏫',
      number: 150,
      label: 'Expert Teachers',
      description: 'Qualified educators with average 10+ years experience',
      gradient: 'linear-gradient(135deg, #56cfe1, #667eea)'
    },
    {
      icon: '🏆',
      number: 45,
      label: 'Awards Won',
      description: 'Recognition in academics, sports, and cultural competitions',
      gradient: 'linear-gradient(135deg, #ffd93d, #ff6b6b)'
    },
    {
      icon: '📅',
      number: 25,
      label: 'Years of Excellence',
      description: 'Serving the community with commitment and dedication',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ffd93d)'
    }
  ];

  // Staff data
  const staffMembers = [
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

  // Albums data
  const albums = [
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

  // Carousel auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Counter animation effect
  useEffect(() => {
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
  }, []);

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

  const filteredAlbums = albums.filter(album => 
    activeFilter === 'all' || album.category === activeFilter
  );

  const visibleAlbums = viewMoreExpanded ? filteredAlbums : filteredAlbums.slice(0, 3);

  return (
    <div className="school-landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src="frontend/src/assets/icons/school_icon.png" alt="School Logo" className="logo-icon" />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#374151' }}>Excellence Public School</div>
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

          <div className="achievement-stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="achievement-stat-card animate-on-scroll" 
                style={{ background: stat.gradient }}
              >
                <div className="achievement-icon">{stat.icon}</div>
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

          <div className="staff-grid">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="staff-card animate-on-scroll">
                <div 
                  className={`staff-image ${staff.isRealPhoto ? 'real-photo' : ''}`}
                  style={staff.isRealPhoto ? { backgroundImage: `url('${staff.image}')` } : {}}
                >
                  {!staff.isRealPhoto && staff.image}
                </div>
                <div className="staff-info">
                  <div className="staff-name">{staff.name}</div>
                  <div className="staff-position">{staff.position}</div>
                  <div className="staff-qualification">{staff.qualification}</div>
                  <div className="staff-experience">
                    <div className="experience-label">Experience</div>
                    <div className="experience-value">{staff.experience}</div>
                  </div>
                  <div className="staff-contact">
                    <a href={`mailto:${staff.email}`} className="contact-btn">📧 Email</a>
                    <a href={`tel:${staff.phone}`} className="contact-btn">📞 Call</a>
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

      {/* Footer Section */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Excellence Public School</h3>
              <p>Dedicated to providing world-class education and nurturing future leaders through innovative teaching methods and holistic development programs.</p>
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
            <p>&copy; 2024 Excellence Public School. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolLandingPage;
