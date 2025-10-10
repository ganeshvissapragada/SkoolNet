import React, { useContext, useState, useEffect } from 'react';
import api from '../api/api.js';
import { AuthContext } from '../auth/AuthContext.jsx';
import attendanceIcon from '../assets/icons/attendance.png';
import marksIcon from '../assets/icons/marks.png';
import scholarshipsIcon from '../assets/icons/scholarships.png';
import mealsIcon from '../assets/icons/meals.png';
import assignmentsIcon from '../assets/icons/assignments.png';
import studentIcon from '../assets/icons/childicon.png'; // Using child icon
import searchIcon from '../assets/icons/search.png';
import translateIcon from '../assets/icons/translate.png';

// Cloudinary optimized carousel images
const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const carousel1 = `${CLOUDINARY_BASE}/c_fill,w_800,h_400,q_auto,f_auto/v1760004319/school-platform/carousel/school-event-1.jpg`;
const carousel2 = `${CLOUDINARY_BASE}/c_fill,w_800,h_400,q_auto,f_auto/v1760004321/school-platform/carousel/school-event-2.jpg`;
const carousel3 = `${CLOUDINARY_BASE}/c_fill,w_800,h_400,q_auto,f_auto/v1760004322/school-platform/carousel/school-event-3.jpg`;

export default function StudentDashboard() {
  const { userId } = useContext(AuthContext);
  
  // Carousel effect (must be at top level)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [mealConsumption, setMealConsumption] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    submission_text: '',
    attachments: []
  });
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCard, setSelectedCard] = useState(null);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('telugu'); // 'telugu' or 'english'
  const [showSearch, setShowSearch] = useState(false); // For search toggle
  const [searchQuery, setSearchQuery] = useState(''); // For search functionality
  const [currentSlide, setCurrentSlide] = useState(0); // For carousel
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // For responsive design

  // Language translations
  const translations = {
    telugu: {
      dashboard: 'డాష్‌బోర్డ్',
      attendance: 'హాజరు',
      marks: 'మార్కులు',
      scholarships: 'స్కాలర్‌షిప్‌లు', 
      meals: 'భోజనం',
      assignments: 'గృహపాఠాలు',
      myProfile: 'నా ప్రొఫైల్',
      backToDashboard: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లు',
      viewDetails: 'వివరాలు చూడండి',
      loading: 'లోడ్ అవుతోంది...',
      noData: 'డేటా లేదు',
      error: 'లోపం',
      present: 'హాజరు',
      absent: 'గైర్హాజరు',
      submit: 'సమర్పించు',
      languageSwitch: 'English'
    },
    english: {
      dashboard: 'Dashboard',
      attendance: 'Attendance',
      marks: 'Marks',
      scholarships: 'Scholarships',
      meals: 'Meals',
      assignments: 'Assignments',
      myProfile: 'My Profile',
      backToDashboard: 'Back to Dashboard',
      viewDetails: 'View Details',
      loading: 'Loading...',
      noData: 'No data available',
      error: 'Error',
      present: 'Present',
      absent: 'Absent',
      submit: 'Submit',
      languageSwitch: 'తెలుగు'
    }
  };

  // Get current language texts
  const texts = translations[language];

  const loadAttendance = async () => {
    setError('');
    try {
      const res = await api.get(`/student/attendance/${userId}`);
      setAttendance(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance');
    }
  };

  const loadMarks = async () => {
    setError('');
    try {
      const res = await api.get(`/student/marks/${userId}`);
      setMarks(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load marks');
    }
  };

  const loadScholarships = async () => {
    setError('');
    try {
      const res = await api.get('/student/scholarships');
      setScholarships(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load scholarships');
      setScholarships([]);
    }
  };

  const loadMealPlans = async () => {
    setError('');
    try {
      const res = await api.get('/student/daily-meal-plan');
      // Convert single object to array if needed
      if (res.data && typeof res.data === 'object') {
        setMealPlans(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setMealPlans([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal plans');
      setMealPlans([]);
    }
  };

  const loadMealConsumption = async () => {
    setError('');
    try {
      const res = await api.get(`/student/my-meal-consumption/${userId}`);
      setMealConsumption(res.data.consumptions || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal consumption');
      setMealConsumption([]);
    }
  };

  const loadAssignments = async () => {
    setError('');
    try {
      const res = await api.get('/student/assignments');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load assignments');
      setAssignments([]);
    }
  };

  const submitMealFeedback = async (mealPlanId, rating, comments) => {
    try {
      await api.post(`/student/meal-feedback/${userId}`, {
        mealPlanId: mealPlanId,
        rating,
        feedback: comments,
        aspects: {},
        isAnonymous: false
      });
      alert('Feedback submitted successfully!');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const submitAssignment = async (assignmentId) => {
    setError('');
    try {
      if (!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0) {
        alert('Please provide either text submission or attachments');
        return;
      }

      console.log('📝 Submitting assignment:', assignmentId);
      console.log('Form data:', submissionForm);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('submission_text', submissionForm.submission_text);
      
      // Add files to FormData
      submissionForm.attachments.forEach((file, index) => {
        console.log(`Adding file ${index}:`, file.name, file.size);
        formData.append('attachments', file);
      });

      console.log('Sending FormData to server...');

      const response = await api.post(`/student/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
          setUploadProgress(percentCompleted);
        }
      });
      
      console.log('✅ Assignment submitted successfully:', response.data);
      alert('Assignment submitted successfully!');
      setSubmissionForm({ submission_text: '', attachments: [] });
      setSelectedAssignment(null);
      setIsSubmissionModalOpen(false);
      setUploadProgress(0);
      loadAssignments(); // Refresh assignments
    } catch (err) {
      console.error('❌ Assignment submission error:', err);
      console.error('Error response:', err.response?.data);
      setError(err?.response?.data?.message || 'Failed to submit assignment');
    }
  };

  const viewAssignmentDetails = async (assignmentId) => {
    setError('');
    try {
      const res = await api.get(`/student/assignments/${assignmentId}`);
      setSelectedAssignment(res.data.assignment);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load assignment details');
    }
  };

  // File handling functions
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has unsupported format.`);
        return false;
      }
      
      return true;
    });

    setSubmissionForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeFile = (index) => {
    setSubmissionForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType === 'text/plain') return '📋';
    return '📎';
  };

  // Responsive styles for both mobile and desktop
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f0f4f9',
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: 0,
      fontSize: '16px'
    },
    header: {
      backgroundColor: 'transparent',
      color: '#374151',
      padding: isDesktop ? '20px 0' : '20px 20px',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: 'none',
      maxWidth: isDesktop ? '1400px' : 'none',
      margin: isDesktop ? '0 auto' : '0',
      paddingLeft: isDesktop ? '20px' : '20px',
      paddingRight: isDesktop ? '20px' : '20px'
    },
    mainContent: {
      maxWidth: isDesktop ? '1400px' : 'none',
      margin: '0 auto',
      padding: isDesktop ? '0 20px 20px 20px' : '0',
      display: isDesktop ? 'grid' : 'block',
      gridTemplateColumns: isDesktop ? '1fr 350px' : 'none',
      gap: isDesktop ? '30px' : '0'
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: isDesktop ? '30px' : '0'
    },
    cardContainer: {
      padding: isDesktop ? '0' : '24px',
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'repeat(auto-fit, minmax(250px, 1fr))' : 'repeat(2, 1fr)',
      gap: isDesktop ? '25px' : '20px',
      maxWidth: isDesktop ? 'none' : '600px',
      margin: isDesktop ? '0' : '0 auto'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: isDesktop ? '20px' : '16px',
      padding: isDesktop ? '30px' : '22px 18px',
      boxShadow: isDesktop ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      border: '1px solid #f0f0f0',
      minHeight: isDesktop ? '200px' : '144px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardIcon: {
      fontSize: isDesktop ? '64px' : '48px',
      marginBottom: isDesktop ? '20px' : '12px',
      display: 'block'
    },
    cardTitle: {
      fontSize: isDesktop ? '18px' : '16px',
      fontWeight: '600',
      marginBottom: isDesktop ? '8px' : '4px',
      color: '#374151',
      lineHeight: '1.2'
    },
    cardDescription: {
      fontSize: isDesktop ? '14px' : '12px',
      color: '#7f8c8d',
      lineHeight: '1.4',
      display: isDesktop ? 'block' : 'none'
    },
    carousel: {
      position: 'relative',
      width: '100%',
      maxWidth: isDesktop ? 'none' : '600px',
      height: isDesktop ? '380px' : '180px',
      margin: isDesktop ? '0 0 0 0' : '0 auto 20px auto',
      borderRadius: isDesktop ? '20px' : '16px',
      overflow: 'hidden',
      boxShadow: isDesktop ? '0 12px 40px rgba(0, 0, 0, 0.15)' : '0 4px 15px rgba(0,0,0,0.1)',
      backgroundColor: '#f8f9fa'
    },
    carouselContainer: {
      display: 'flex',
      width: '100%',
      height: isDesktop ? '380px' : '180px',
      transition: 'transform 0.5s ease-in-out'
    },
    carouselSlide: {
      minWidth: '100%',
      width: '100%',
      height: isDesktop ? '380px' : '180px',
      borderRadius: isDesktop ? '20px' : '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    carouselDots: {
      display: 'flex',
      justifyContent: 'center',
      gap: isDesktop ? '12px' : '8px',
      padding: isDesktop ? '20px' : '15px',
      position: 'absolute',
      bottom: isDesktop ? '20px' : '10px',
      width: '100%'
    },
    carouselDot: {
      width: isDesktop ? '12px' : '8px',
      height: isDesktop ? '12px' : '8px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    carouselDotActive: {
      backgroundColor: 'rgba(255,255,255,1)',
      transform: isDesktop ? 'scale(1.2)' : 'scale(1)'
    },
    sidebar: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      height: 'fit-content',
      display: isDesktop ? 'block' : 'none'
    },
    sidebarTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    quickStats: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    statItem: {
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px'
    },
    detailsContainer: {
      padding: isDesktop ? '30px' : '20px',
      maxWidth: isDesktop ? '1400px' : '800px',
      margin: '0 auto'
    }
  };

  const cards = [
    {
      id: 'attendance',
      icon: attendanceIcon,
      title: texts.attendance,
      description: 'View your daily attendance records and track your presence',
      loadData: loadAttendance
    },
    {
      id: 'marks',
      icon: marksIcon,
      title: texts.marks,
      description: 'Check your exam scores, grades, and academic performance',
      loadData: loadMarks
    },
    {
      id: 'scholarships',
      icon: scholarshipsIcon,
      title: texts.scholarships,
      description: 'Explore available scholarships and financial aid opportunities',
      loadData: loadScholarships
    },
    {
      id: 'meals',
      icon: mealsIcon,
      title: texts.meals,
      description: 'View meal plans, nutrition info, and submit feedback',
      loadData: () => {loadMealPlans(); loadMealConsumption();}
    },
    {
      id: 'assignments',
      icon: assignmentsIcon,
      title: texts.assignments,
      description: 'View and manage your assignments and submissions',
      loadData: loadAssignments
    }
  ];

  // Sidebar component for desktop view
  const renderSidebar = () => {
    if (!isDesktop) return null;

    const quickStats = [
      {
        icon: attendanceIcon,
        title: language === 'english' ? 'Attendance Rate' : 'హాజరు రేటు',
        value: language === 'english' ? '98% This Month' : '98% ఈ నెల'
      },
      {
        icon: marksIcon,
        title: language === 'english' ? 'Overall Grade' : 'మొత్తం గ్రేడ్',
        value: language === 'english' ? 'A Average' : 'A సగటు'
      },
      {
        icon: assignmentsIcon,
        title: language === 'english' ? 'Pending Tasks' : 'పెండింగ్ పనులు',
        value: language === 'english' ? '2 Assignments' : '2 గృహపాఠాలు'
      },
      {
        icon: mealsIcon,
        title: language === 'english' ? "Today's Meal" : 'నేటి భోజనం',
        value: language === 'english' ? 'Nutritious & Fresh' : 'పోషకమైన & తాజా'
      },
      {
        icon: scholarshipsIcon,
        title: language === 'english' ? 'Scholarships' : 'స్కాలర్‌షిప్‌లు',
        value: language === 'english' ? '3 Available' : '3 అందుబాటులో'
      }
    ];

    return (
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>
          {language === 'english' ? 'Quick Overview' : 'త్వరిత సమీక్ష'}
        </h3>
        <div style={styles.quickStats}>
          {quickStats.map((stat, index) => (
            <div key={index} style={styles.statItem}>
              <div style={styles.statIcon}>
                <img 
                  src={stat.icon} 
                  alt={stat.title}
                  style={{
                    width: '24px',
                    height: '24px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  marginBottom: '4px'
                }}>
                  {stat.title}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#7f8c8d'
                }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    // Filter cards based on search query
    const filteredCards = cards.filter(card => 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div style={styles.mainContent}>
        <div style={styles.leftSection}>
          {/* Carousel Section - only show when not searching */}
          {!searchQuery && (
            <div style={{ padding: isDesktop ? '0' : '20px 24px 0 24px' }}>
              <div style={styles.carousel}>
                <div 
                  style={{
                    ...styles.carouselContainer,
                    transform: `translateX(-${currentSlide * 100}%)`
                  }}
                >
                  <div style={styles.carouselSlide}>
                    <img 
                      src={carousel1} 
                      alt="School 1"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: isDesktop ? '20px' : '16px'
                      }}
                    />
                  </div>
                  <div style={styles.carouselSlide}>
                    <img 
                      src={carousel2} 
                      alt="School 2"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: isDesktop ? '20px' : '16px'
                      }}
                    />
                  </div>
                  <div style={styles.carouselSlide}>
                    <img 
                      src={carousel3} 
                      alt="School 3"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: isDesktop ? '20px' : '16px'
                      }}
                    />
                  </div>
                </div>
                
                {/* Carousel dots */}
                <div style={styles.carouselDots}>
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.carouselDot,
                        ...(currentSlide === index ? styles.carouselDotActive : {})
                      }}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cards Section */}
          <div style={styles.cardContainer}>
            {searchQuery && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '10px',
                fontSize: '14px',
                color: '#666',
                marginBottom: '10px'
              }}>
                {language === 'english' ? `Showing ${filteredCards.length} results for "${searchQuery}"` : `"${searchQuery}" కోసం ${filteredCards.length} ఫలితాలు`}
              </div>
            )}
            
            {filteredCards.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <div>{language === 'english' ? 'No results found' : 'ఫలితాలు లేవు'}</div>
              </div>
            ) : (
              filteredCards.map(card => (
                <div
                  key={card.id}
                  style={styles.card}
                  onClick={() => {
                    setSelectedCard(card);
                    setCurrentView(card.id);
                    setShowSearch(false); // Hide search when navigating
                    setSearchQuery(''); // Clear search
                    card.loadData();
                  }}
                  onMouseEnter={(e) => {
                    if (isDesktop) {
                      e.target.style.transform = 'translateY(-8px)';
                      e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isDesktop) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <img 
                    src={card.icon} 
                    alt={card.title}
                    style={{
                      width: isDesktop ? '64px' : '48px',
                      height: isDesktop ? '64px' : '48px',
                      marginBottom: isDesktop ? '20px' : '12px',
                      objectFit: 'contain'
                    }}
                  />
                  <div style={styles.cardTitle}>
                    {card.title}
                  </div>
                  {isDesktop && (
                    <div style={styles.cardDescription}>
                      {card.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Sidebar - Only show on desktop */}
        {renderSidebar()}
      </div>
    );
  };

  const renderAttendanceDetails = () => (
    <div style={styles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📚 My Attendance Records
        </h3>
        
        {!attendance ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📚</div>
            <button
              onClick={loadAttendance}
              style={{
                padding: '15px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Load My Attendance
            </button>
          </div>
        ) : attendance.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div>No attendance records found</div>
          </div>
        ) : (
          <div>
            {attendance.map((record, index) => (
              <div key={record._id || index} style={{
                backgroundColor: record.status === 'Present' ? '#e8f5e8' : '#ffe8e8',
                border: `2px solid ${record.status === 'Present' ? '#27ae60' : '#e74c3c'}`,
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '5px'}}>
                    📅 {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div style={{color: '#7f8c8d'}}>
                    {new Date(record.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: record.status === 'Present' ? '#27ae60' : '#e74c3c'
                }}>
                  {record.status === 'Present' ? '✅ Present' : '❌ Absent'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMarksDetails = () => (
    <div style={styles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📊 My Marks & Grades
        </h3>
        
        {!marks ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📊</div>
            <button
              onClick={loadMarks}
              style={{
                padding: '15px 30px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Load My Marks
            </button>
          </div>
        ) : marks.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div>No marks records found</div>
          </div>
        ) : (
          <div>
            {marks.map((record, index) => {
              const percentage = ((record.marksObtained / record.totalMarks) * 100).toFixed(1);
              const grade = percentage >= 90 ? 'A+' : 
                           percentage >= 80 ? 'A' : 
                           percentage >= 70 ? 'B+' : 
                           percentage >= 60 ? 'B' : 
                           percentage >= 50 ? 'C' : 'F';
              const isGood = percentage >= 60;
              
              return (
                <div key={record._id || index} style={{
                  backgroundColor: isGood ? '#e8f5e8' : '#ffe8e8',
                  border: `2px solid ${isGood ? '#27ae60' : '#e74c3c'}`,
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <div style={{fontSize: '18px', fontWeight: 'bold'}}>
                      📚 Subject: {record.subjectId}
                    </div>
                    <div style={{
                      backgroundColor: isGood ? '#27ae60' : '#e74c3c',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontWeight: 'bold'
                    }}>
                      Grade: {grade}
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px'}}>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Marks Obtained</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: isGood ? '#27ae60' : '#e74c3c'}}>
                        {record.marksObtained}/{record.totalMarks}
                      </div>
                    </div>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Percentage</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: isGood ? '#27ae60' : '#e74c3c'}}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#7f8c8d'}}>
                    <div>Exam Type: {record.examType}</div>
                    <div>Date: {new Date(record.date).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderScholarshipsDetails = () => (
    <div style={styles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          🏆 Available Scholarships
        </h3>
        
        {!scholarships || scholarships.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🏆</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              No scholarships available at the moment
            </div>
            <button
              onClick={loadScholarships}
              style={{
                padding: '15px 30px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Check for Scholarships
            </button>
          </div>
        ) : (
          <div>
            {scholarships.map(scholarship => {
              const daysRemaining = Math.ceil((new Date(scholarship.application_deadline) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={scholarship.id} style={{
                  backgroundColor: '#fff',
                  border: '2px solid #f39c12',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#f39c12'}}>
                    🏆 {scholarship.title}
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Amount</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: '#27ae60'}}>
                        ₹{parseFloat(scholarship.scholarship_amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>Application Deadline</div>
                      <div style={{fontWeight: 'bold', color: daysRemaining <= 7 ? '#e74c3c' : '#f39c12'}}>
                        {new Date(scholarship.application_deadline).toLocaleDateString()}
                      </div>
                      <div style={{fontSize: '12px', color: daysRemaining <= 7 ? '#e74c3c' : '#f39c12'}}>
                        {daysRemaining > 0 ? `⏳ ${daysRemaining} days left` : '❌ Deadline passed'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{marginBottom: '10px'}}>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>Eligibility Criteria</div>
                    <div style={{fontSize: '14px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                      {scholarship.eligibility_criteria}
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#7f8c8d'}}>
                    <div>Type: {scholarship.scholarship_type}</div>
                    <div>Contact: {scholarship.contact_email}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderMealsDetails = () => (
    <div style={styles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          🍽️ Daily Meal Plan
        </h3>
        
        {!mealPlans || mealPlans.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🍽️</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              No meal plan available for today
            </div>
            <button
              onClick={() => {loadMealPlans(); loadMealConsumption();}}
              style={{
                padding: '15px 30px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Load Meal Data
            </button>
          </div>
        ) : (
          <div>
            {Array.isArray(mealPlans) && mealPlans.map(plan => (
              <div key={plan.id} style={{
                backgroundColor: '#fff',
                border: '2px solid #27ae60',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: '#27ae60'}}>
                    🍽️ {plan.meal_name}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: '#d4edda',
                    color: '#155724'
                  }}>
                    Today's Menu
                  </div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Description</div>
                  <div>{plan.description}</div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Menu Items</div>
                  <div style={{fontSize: '14px'}}>
                    {plan.items.join(', ')}
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>Nutrition</div>
                    <div style={{fontSize: '12px'}}>
                      Calories: {plan.nutritional_info?.calories}<br/>
                      Protein: {plan.nutritional_info?.protein}g
                    </div>
                  </div>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>Allergens</div>
                    <div style={{fontSize: '12px'}}>
                      {plan.allergens?.length > 0 ? plan.allergens.join(', ') : 'None'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const rating = prompt('Rate this meal (1-5 stars):');
                    const comments = prompt('Any comments about the meal?');
                    if (rating && rating >= 1 && rating <= 5) {
                      submitMealFeedback(plan.id, parseInt(rating), comments || '');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ⭐ Rate This Meal
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAssignmentsDetails = () => (
    <div style={styles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📋 My Assignments
        </h3>
        
        {!assignments || assignments.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              No assignments found
            </div>
            <button
              onClick={loadAssignments}
              style={{
                padding: '15px 30px',
                backgroundColor: '#8e44ad',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Refresh Assignments
            </button>
          </div>
        ) : (
          <div>
            {assignments.map(assignment => (
              <div key={assignment.id} style={{
                backgroundColor: '#fff',
                border: '2px solid #8e44ad',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: '#8e44ad'}}>
                    📋 {assignment.title}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: '#d1c4e9',
                    color: '#6a5b8a'
                  }}>
                    {assignment.status}
                  </div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Description</div>
                  <div>{assignment.description}</div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>Due Date</div>
                  <div style={{fontWeight: 'bold', color: '#c0392b'}}>
                    {new Date(assignment.due_date).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#7f8c8d'}}>
                  <div>Type: {assignment.type}</div>
                  <div>
                    <button
                      onClick={() => viewAssignmentDetails(assignment.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#8e44ad',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedAssignment && (
          <div style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            padding: '15px',
            marginTop: '15px',
            border: '1px solid #e1e8ed'
          }}>
            <h4 style={{color: '#2c3e50', marginBottom: '10px'}}>
              Assignment Details
            </h4>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Title</div>
              <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                {selectedAssignment.title}
              </div>
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Description</div>
              <div>{selectedAssignment.description}</div>
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Due Date</div>
              <div style={{fontWeight: 'bold', color: '#c0392b'}}>
                {new Date(selectedAssignment.due_date).toLocaleDateString()}
              </div>
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#7f8c8d', fontSize: '14px'}}>Attachments</div>
              <div>
                {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 ? (
                  <ul style={{paddingLeft: '20px', margin: 0}}>
                    {selectedAssignment.attachments.map((file, index) => (
                      <li key={index} style={{marginBottom: '5px'}}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" style={{color: '#3498db', textDecoration: 'underline'}}>
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{color: '#7f8c8d'}}>No attachments</div>
                )}
              </div>
            </div>
            
            {/* Submission Status */}
            {selectedAssignment.submission_status !== 'pending' && (
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: selectedAssignment.submission_status === 'submitted' ? '#d5f4e6' : '#ffeaa7',
                borderRadius: '8px',
                border: '1px solid ' + (selectedAssignment.submission_status === 'submitted' ? '#00b894' : '#fdcb6e')
              }}>
                <h5 style={{ 
                  margin: '0 0 8px 0', 
                  color: selectedAssignment.submission_status === 'submitted' ? '#00b894' : '#e17055',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {selectedAssignment.submission_status === 'submitted' ? '✅' : '🔄'} 
                  Assignment {selectedAssignment.submission_status === 'submitted' ? 'Submitted' : 'Resubmitted'}
                </h5>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#2c3e50' }}>
                  Submitted on: {selectedAssignment.submitted_at ? new Date(selectedAssignment.submitted_at).toLocaleString() : 'N/A'}
                </p>
                {selectedAssignment.is_late && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#e74c3c', fontWeight: 'bold' }}>
                    ⚠️ Late Submission
                  </p>
                )}
                {selectedAssignment.marks_obtained !== null && (
                  <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>
                    Grade: {selectedAssignment.marks_obtained}/{selectedAssignment.max_marks}
                  </p>
                )}
                {selectedAssignment.feedback && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>Teacher Feedback:</div>
                    <div style={{ fontSize: '14px', color: '#2c3e50', fontStyle: 'italic' }}>
                      "{selectedAssignment.feedback}"
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              {selectedAssignment.submission_status === 'pending' && (
                <button
                  onClick={() => setIsSubmissionModalOpen(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  📝 Submit Assignment
                </button>
              )}
              <button
                onClick={() => setSelectedAssignment(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left side - Student icon and name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentView !== 'dashboard' && (
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#374151',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(55,65,81,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {
                  setCurrentView('dashboard');
                  setSelectedCard(null);
                  setError('');
                  setShowSearch(false);
                  setSearchQuery('');
                }}
              >
                ← {texts.backToDashboard}
              </button>
            )}
            
            {currentView === 'dashboard' && (
              <>
                {/* Student Icon */}
                <img 
                  src={studentIcon} 
                  alt="Student"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Student Name */}
                <div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {language === 'english' ? 'Emma Johnson' : 'ఎమ్మా జాన్సన్'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(55, 65, 81, 0.7)'
                  }}>
                    {language === 'english' ? 'Student' : 'విద్యార్థి'}
                  </div>
                </div>
              </>
            )}
            
            {currentView !== 'dashboard' && (
              <h1 style={{ margin: '0', fontSize: '20px', color: '#374151' }}>
                {selectedCard?.title}
              </h1>
            )}
          </div>
          
          {/* Right side - Search and Translate icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Icon */}
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(55,65,81,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              onClick={() => setShowSearch(!showSearch)}
            >
              <img 
                src={searchIcon} 
                alt="Search"
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain'
                }}
              />
            </button>
            
            {/* Translate Icon */}
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(55,65,81,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              onClick={() => setLanguage(language === 'telugu' ? 'english' : 'telugu')}
            >
              <img 
                src={translateIcon} 
                alt="Translate"
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain'
                }}
              />
            </button>
          </div>
        </div>
        
        {/* Search Bar - Shows when search is clicked */}
        {showSearch && (
          <div style={{
            marginTop: '15px',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder={language === 'english' ? 'Search features...' : 'ఫీచర్లను వెతకండి...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'rgba(255,255,255,0.95)',
                color: '#374151',
                boxSizing: 'border-box'
              }}
              autoFocus
            />
          </div>
        )}
      </div>

      {error && (
        <div style={{
          margin: '20px',
          padding: '15px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33',
          textAlign: 'center'
        }}>
          Error: {error}
        </div>
      )}

      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'attendance' && renderAttendanceDetails()}
      {currentView === 'marks' && renderMarksDetails()}
      {currentView === 'scholarships' && renderScholarshipsDetails()}
      {currentView === 'meals' && renderMealsDetails()}
      {currentView === 'assignments' && renderAssignmentsDetails()}

      {/* Modern Assignment Submission Modal */}
      {isSubmissionModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #e1e8ed',
              paddingBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                📝 Submit Assignment
              </h3>
              <button
                onClick={() => {
                  setIsSubmissionModalOpen(false);
                  setSubmissionForm({ submission_text: '', attachments: [] });
                  setUploadProgress(0);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#7f8c8d',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#2c3e50', margin: '0 0 8px 0' }}>
                {selectedAssignment?.title}
              </h4>
              <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>
                Due: {selectedAssignment ? new Date(selectedAssignment.due_date).toLocaleDateString() : ''}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Assignment Text/Response:
              </label>
              <textarea
                value={submissionForm.submission_text}
                onChange={(e) => setSubmissionForm(prev => ({ ...prev, submission_text: e.target.value }))}
                placeholder="Enter your assignment response, solution, or any text submission..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3498db'}
                onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                📎 Attach Files:
              </label>
              
              {/* File Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? '#3498db' : '#bdc3c7'}`,
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                  backgroundColor: dragActive ? '#ecf0f1' : '#f8f9fa',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {dragActive ? '📁' : '📎'}
                </div>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  {dragActive ? 'Drop files here' : 'Click to select files or drag & drop'}
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '12px', 
                  color: '#7f8c8d' 
                }}>
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (Max 10MB each)
                </p>
                
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
              </div>

              {/* Selected Files List */}
              {submissionForm.attachments.length > 0 && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h5 style={{ 
                    margin: '0 0 12px 0', 
                    color: '#2c3e50',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    Selected Files ({submissionForm.attachments.length}):
                  </h5>
                  
                  {submissionForm.attachments.map((file, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      border: '1px solid #e1e8ed'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '18px', marginRight: '8px' }}>
                          {getFileIcon(file.type)}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {file.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#7f8c8d'
                          }}>
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '4px',
                          marginLeft: '8px'
                        }}
                        title="Remove file"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  backgroundColor: '#ecf0f1',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#3498db',
                    height: '100%',
                    width: `${uploadProgress}%`,
                    transition: 'width 0.3s',
                    borderRadius: '8px'
                  }} />
                </div>
                <p style={{
                  textAlign: 'center',
                  margin: '8px 0 0 0',
                  fontSize: '12px',
                  color: '#7f8c8d'
                }}>
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              borderTop: '1px solid #e1e8ed',
              paddingTop: '16px'
            }}>
              <button
                onClick={() => {
                  setIsSubmissionModalOpen(false);
                  setSubmissionForm({ submission_text: '', attachments: [] });
                  setUploadProgress(0);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => submitAssignment(selectedAssignment.id)}
                disabled={!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0) ? '#bdc3c7' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: (!submissionForm.submission_text.trim() && submissionForm.attachments.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                🚀 Submit Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
