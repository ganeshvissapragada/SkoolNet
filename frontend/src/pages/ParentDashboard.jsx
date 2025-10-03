import React, { useContext, useState, useEffect } from 'react';
import api from '../api/api.js';
import { AuthContext } from '../auth/AuthContext.jsx';
import attendanceIcon from '../assets/icons/attendance.png';
import marksIcon from '../assets/icons/marks.png';
import ptmIcon from '../assets/icons/ptm.png';
import scholarshipsIcon from '../assets/icons/scholarships.png';
import mealsIcon from '../assets/icons/meals.png';
import assignmentsIcon from '../assets/icons/assignments.png';
import parentIcon from '../assets/icons/parents.png';
import searchIcon from '../assets/icons/search.png';
import translateIcon from '../assets/icons/translate.png';
import carousel1 from '../assets/carousel/WhatsApp Image 2025-09-06 at 18.44.53.jpeg';
import carousel2 from '../assets/carousel/WhatsApp Image 2025-09-06 at 18.44.54.jpeg';
import carousel3 from '../assets/carousel/WhatsApp Image 2025-09-06 at 18.44.55.jpeg';

export default function ParentDashboard() {
  const { userId } = useContext(AuthContext);
  
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [ptms, setPtms] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [mealConsumption, setMealConsumption] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or specific feature
  const [selectedCard, setSelectedCard] = useState(null);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('telugu'); // 'telugu' or 'english'
  const [showSearch, setShowSearch] = useState(false); // For search toggle
  const [searchQuery, setSearchQuery] = useState(''); // For search functionality
  const [currentSlide, setCurrentSlide] = useState(0); // For carousel

  // Language translations
  const translations = {
    telugu: {
      dashboard: 'డాష్‌బోర్డ్',
      attendance: 'హాజరు',
      marks: 'మార్కులు',
      ptm: 'తల్లిదండ్రుల సమావేశం',
      scholarships: 'స్కాలర్‌షిప్‌లు', 
      meals: 'భోజనం',
      assignments: 'గృహపాఠాలు',
      myChild: 'నా పిల్లవాడు',
      backToDashboard: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లు',
      viewDetails: 'వివరాలు చూడండి',
      loading: 'లోడ్ అవుతోంది...',
      noData: 'డేటా లేదు',
      error: 'లోపం',
      present: 'హాజరు',
      absent: 'గైర్హాజరు',
      totalMarks: 'మొత్తం మార్కులు',
      obtained: 'పొందిన మార్కులు',
      percentage: 'శాతం',
      meetingWith: 'తో సమావేశం',
      scheduledOn: 'తేదీ',
      confirm: 'ధృవీకరించండి',
      reject: 'తిరస్కరించండి',
      scholarshipInfo: 'స్కాలర్‌షిప్ సమాచారం',
      mealPlan: 'భోజన ప్రణాళిక',
      feedback: 'అభిప్రాయం',
      languageSwitch: 'English'
    },
    english: {
      dashboard: 'Dashboard',
      attendance: 'Attendance',
      marks: 'Marks',
      ptm: 'Parent-Teacher Meeting',
      scholarships: 'Scholarships',
      meals: 'Meals',
      assignments: 'Assignments',
      myChild: 'My Child',
      backToDashboard: 'Back to Dashboard',
      viewDetails: 'View Details',
      loading: 'Loading...',
      noData: 'No data available',
      error: 'Error',
      present: 'Present',
      absent: 'Absent',
      totalMarks: 'Total Marks',
      obtained: 'Obtained Marks',
      percentage: 'Percentage',
      meetingWith: 'Meeting with',
      scheduledOn: 'Scheduled on',
      confirm: 'Confirm',
      reject: 'Reject',
      scholarshipInfo: 'Scholarship Information',
      mealPlan: 'Meal Plan',
      feedback: 'Feedback',
      languageSwitch: 'తెలుగు'
    }
  };

  // Get current language texts
  const texts = translations[language];

  const loadAttendance = async () => {
    setError('');
    try {
      const res = await api.get(`/parent/attendance/child/${userId}`);
      setAttendance(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance');
    }
  };

  const loadMarks = async () => {
    setError('');
    try {
      const res = await api.get(`/parent/marks/child/${userId}`);
      setMarks(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load marks');
    }
  };

  const loadPTMs = async () => {
    setError('');
    try {
      const res = await api.get('/parent/ptms');
      setPtms(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load PTMs');
    }
  };

  const loadScholarships = async () => {
    setError('');
    try {
      const res = await api.get('/parent/scholarships');
      setScholarships(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load scholarships');
    }
  };

  const loadMealPlans = async () => {
    setError('');
    try {
      const res = await api.get('/parent/daily-meal-plan');
      // API returns a single meal plan object, convert to array
      if (res.data && typeof res.data === 'object') {
        setMealPlans(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setMealPlans([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal plans');
      setMealPlans([]); // Set empty array on error
    }
  };

  const loadMealConsumption = async () => {
    setError('');
    try {
      const res = await api.get(`/parent/my-meal-consumption/${userId}`);
      setMealConsumption(res.data.consumptions || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load meal consumption');
    }
  };

  const loadAssignments = async () => {
    setError('');
    try {
      const res = await api.get('/parent/assignments');
      setAssignments(res.data.assignments || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load assignments');
      setAssignments([]);
    }
  };

  const confirmPTM = async (ptmId) => {
    try {
      await api.put(`/parent/ptm/${ptmId}/confirm`);
      setPtms(prevPtms => 
        prevPtms.map(ptm => 
          ptm.id === ptmId ? { ...ptm, status: 'confirmed' } : ptm
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to confirm PTM');
    }
  };

  const submitMealFeedback = async (mealPlanId, rating, comments) => {
    try {
      await api.post(`/parent/meal-feedback/${userId}`, {
        mealPlanId: mealPlanId,
        rating,
        feedback: comments,
        aspects: {},
        isAnonymous: false
      });
      alert('అభిప్రాయం విజయవంతంగా సమర్పించబడింది!');
      loadMealConsumption();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit feedback');
    }
  };

  // Mobile-friendly styles
  const mobileStyles = {
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
      padding: '20px 20px',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: 'none'
    },
    backButton: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '10px'
    },
    cardContainer: {
      padding: '24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '22px 18px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      border: '1px solid #f0f0f0',
      minHeight: '144px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardIcon: {
      fontSize: '48px',
      marginBottom: '12px',
      display: 'block'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '4px',
      color: '#374151',
      lineHeight: '1.2'
    },
    cardDescription: {
      fontSize: '12px',
      color: '#7f8c8d',
      lineHeight: '1.3',
      display: 'none' // Hide description on smaller cards
    },
    carousel: {
      position: 'relative',
      width: '100%',
      maxWidth: '600px',
      height: '180px',
      margin: '0 auto 20px auto',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      backgroundColor: '#f8f9fa'
    },
    carouselContainer: {
      display: 'flex',
      width: '100%',
      height: '180px',
      transition: 'transform 0.3s ease-in-out'
    },
    carouselSlide: {
      minWidth: '100%',
      width: '100%',
      height: '180px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    carouselDots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      padding: '15px',
      position: 'absolute',
      bottom: '10px',
      width: '100%'
    },
    carouselDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    carouselDotActive: {
      backgroundColor: 'rgba(255,255,255,1)'
    },
    detailsContainer: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }
  };

  // Carousel slides data
  const carouselSlides = [
    {
      id: 1,
      image: carousel1,
      background: `url(${carousel1})`
    },
    {
      id: 2,
      image: carousel2,
      background: `url(${carousel2})`
    },
    {
      id: 3,
      image: carousel3,
      background: `url(${carousel3})`
    }
  ];

  const cards = [
    {
      id: 'attendance',
      icon: attendanceIcon,
      title: texts.attendance,
      description: 'మీ పిల్లవాడి రోజువారీ హాజరు రికార్డులను చూడండి',
      loadData: loadAttendance
    },
    {
      id: 'marks',
      icon: marksIcon,
      title: texts.marks,
      description: 'మీ పిల్లవాడి పరీక్ష మార్కులు మరియు గ్రేడ్‌లను చూడండి',
      loadData: loadMarks
    },
    {
      id: 'ptm',
      icon: ptmIcon,
      title: texts.ptm,
      description: 'టీచర్‌తో సమావేశాలను వీక్షించండి మరియు ధృవీకరించండి',
      loadData: loadPTMs
    },
    {
      id: 'scholarships',
      icon: scholarshipsIcon,
      title: texts.scholarships,
      description: 'మీ పిల్లవాడికి లభ్యమైన స్కాలర్‌షిప్‌లను చూడండి',
      loadData: loadScholarships
    },
    {
      id: 'meals',
      icon: mealsIcon,
      title: texts.meals,
      description: 'రోజువారీ భోజన ప్రణాళిక మరియు పోషకాహారాన్ని చూడండి',
      loadData: () => {loadMealPlans(); loadMealConsumption();}
    },
    {
      id: 'assignments',
      icon: assignmentsIcon,
      title: texts.assignments,
      description: 'మీ పిల్లవాడి గృహపాఠాలు మరియు సమర్పణలను చూడండి',
      loadData: loadAssignments
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Carousel component
  const renderCarousel = () => {
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    const goToSlide = (index) => {
      setCurrentSlide(index);
    };

    return (
      <div style={mobileStyles.carousel}>
        <div 
          style={{
            ...mobileStyles.carouselContainer,
            transform: `translateX(-${currentSlide * 100}%)`
          }}
        >
          {carouselSlides.map((slide) => (
            <div
              key={slide.id}
              style={mobileStyles.carouselSlide}
            >
              <img 
                src={slide.image}
                alt={`School slide ${slide.id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
                onError={(e) => {
                  console.log('Image failed to load:', slide.image);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Carousel dots */}
        <div style={mobileStyles.carouselDots}>
          {carouselSlides.map((_, index) => (
            <div
              key={index}
              style={{
                ...mobileStyles.carouselDot,
                ...(index === currentSlide ? mobileStyles.carouselDotActive : {})
              }}
              onClick={() => goToSlide(index)}
            />
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
      <div>
        {/* Carousel Section - only show when not searching */}
        {!searchQuery && (
          <div style={{ padding: '20px 24px 0 24px' }}>
            {renderCarousel()}
          </div>
        )}
        
        {/* Cards Section */}
        <div style={mobileStyles.cardContainer}>
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
                style={mobileStyles.card}
                onClick={() => {
                  setSelectedCard(card);
                  setCurrentView(card.id);
                  setShowSearch(false); // Hide search when navigating
                  setSearchQuery(''); // Clear search
                  card.loadData();
                }}
              >
                <div style={mobileStyles.cardIcon}>
                  {typeof card.icon === 'string' && (card.icon.includes('.png') || card.icon.includes('.svg')) ? (
                    <img 
                      src={card.icon} 
                      alt={card.title}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    card.icon
                  )}
                </div>
                <div style={mobileStyles.cardTitle}>
                  {card.title}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderAttendanceDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📚 {texts.attendance} రికార్డులు
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
              హాజరు లోడ్ చేయండి
            </button>
          </div>
        ) : attendance.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div>హాజరు రికార్డులు లేవు</div>
          </div>
        ) : (
          <div>
            {attendance.map((record, index) => (
              <div key={index} style={{
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
                    📅 {new Date(record.date).toLocaleDateString('te-IN')}
                  </div>
                  <div style={{color: '#7f8c8d'}}>
                    తేదీ: {new Date(record.date).toLocaleDateString('te-IN', {
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
                  {record.status === 'Present' ? '✅ ' + texts.present : '❌ ' + texts.absent}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMarksDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📊 {texts.marks} రికార్డులు
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
              మార్కులు లోడ్ చేయండి
            </button>
          </div>
        ) : marks.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#7f8c8d'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div>మార్కుల రికార్డులు లేవు</div>
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
                <div key={index} style={{
                  backgroundColor: isGood ? '#e8f5e8' : '#ffe8e8',
                  border: `2px solid ${isGood ? '#27ae60' : '#e74c3c'}`,
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <div style={{fontSize: '18px', fontWeight: 'bold'}}>
                      📚 విషయం: {record.subjectId}
                    </div>
                    <div style={{
                      backgroundColor: isGood ? '#27ae60' : '#e74c3c',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontWeight: 'bold'
                    }}>
                      గ్రేడ్: {grade}
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px'}}>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>పొందిన మార్కులు</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: isGood ? '#27ae60' : '#e74c3c'}}>
                        {record.marksObtained}/{record.totalMarks}
                      </div>
                    </div>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>శాతం</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: isGood ? '#27ae60' : '#e74c3c'}}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#7f8c8d'}}>
                    <div>పరీక్ష రకం: {record.examType}</div>
                    <div>తేదీ: {new Date(record.date).toLocaleDateString('te-IN')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderPTMDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          👨‍👩‍👧‍👦 {texts.ptm}
        </h3>
        
        {!ptms || ptms.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>👨‍👩‍👧‍👦</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              తల్లిదండ్రుల సమావేశాలు లేవు
            </div>
            <button
              onClick={loadPTMs}
              style={{
                padding: '15px 30px',
                backgroundColor: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              సమావేశాలు లోడ్ చేయండి
            </button>
          </div>
        ) : (
          <div>
            {ptms.map(meeting => (
              <div key={meeting.id} style={{
                backgroundColor: '#fff',
                border: '2px solid #9b59b6',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#9b59b6'}}>
                  👨‍🏫 టీచర్: {meeting.teacher?.name}
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>విద్యార్థి</div>
                  <div style={{fontWeight: 'bold'}}>
                    {meeting.student?.name} (క్లాస్: {meeting.student?.class} {meeting.student?.section})
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>తేదీ</div>
                    <div style={{fontWeight: 'bold'}}>
                      📅 {new Date(meeting.meeting_date).toLocaleDateString('te-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>సమయం</div>
                    <div style={{fontWeight: 'bold'}}>
                      🕐 {meeting.meeting_time}
                    </div>
                  </div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>కారణం</div>
                  <div>{meeting.reason}</div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: meeting.status === 'scheduled' ? '#fff3cd' :
                                   meeting.status === 'confirmed' ? '#d4edda' : '#f8d7da',
                    color: meeting.status === 'scheduled' ? '#856404' :
                           meeting.status === 'confirmed' ? '#155724' : '#721c24'
                  }}>
                    {meeting.status === 'scheduled' ? 'షెడ్యూల్డ్' :
                     meeting.status === 'confirmed' ? 'ధృవీకరించబడింది' : meeting.status}
                  </div>
                  
                  {meeting.status === 'scheduled' && (
                    <button
                      onClick={() => confirmPTM(meeting.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ ధృవీకరించండి
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderScholarshipsDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          🏆 {texts.scholarships}
        </h3>
        
        {!scholarships || scholarships.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🏆</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              ప్రస్తుతం స్కాలర్‌షిప్‌లు లేవు
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
              స్కాలర్‌షిప్‌లు లోడ్ చేయండి
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
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>మొత్తం</div>
                      <div style={{fontSize: '20px', fontWeight: 'bold', color: '#27ae60'}}>
                        ₹{parseFloat(scholarship.scholarship_amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div style={{color: '#7f8c8d', fontSize: '14px'}}>దరఖాస్తు చివరి తేదీ</div>
                      <div style={{fontWeight: 'bold', color: daysRemaining <= 7 ? '#e74c3c' : '#f39c12'}}>
                        {new Date(scholarship.application_deadline).toLocaleDateString('te-IN')}
                      </div>
                      <div style={{fontSize: '12px', color: daysRemaining <= 7 ? '#e74c3c' : '#f39c12'}}>
                        {daysRemaining > 0 ? `⏳ ${daysRemaining} రోజులు మిగిలాయి` : '❌ గడువు ముగిసింది'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{marginBottom: '10px'}}>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>అర్హతా ప్రమాణాలు</div>
                    <div style={{fontSize: '14px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                      {scholarship.eligibility_criteria}
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#7f8c8d'}}>
                    <div>రకం: {scholarship.scholarship_type}</div>
                    <div>సంప్రదింపు: {scholarship.contact_email}</div>
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
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          🍽️ {texts.meals} ప్రణాళిక
        </h3>
        
        {!mealPlans || mealPlans.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🍽️</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              నేటికి భోజన ప్రణాళిక లేదు
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
              భోజన డేటా లోడ్ చేయండి
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
                    backgroundColor: plan.status === 'served' ? '#d4edda' : '#fff3cd',
                    color: plan.status === 'served' ? '#155724' : '#856404'
                  }}>
                    {plan.status === 'served' ? 'వడ్డించబడింది' : 'ప్రణాళిక చేయబడింది'}
                  </div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>వివరణ</div>
                  <div>{plan.description}</div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>మెనూ ఐటమ్స్</div>
                  <div style={{fontSize: '14px'}}>
                    {plan.items.join(', ')}
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>పోషకాలు</div>
                    <div style={{fontSize: '12px'}}>
                      కేలరీలు: {plan.nutritional_info?.calories}<br/>
                      ప్రోటీన్: {plan.nutritional_info?.protein}గ్రా
                    </div>
                  </div>
                  <div>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>అలర్జీ కారకాలు</div>
                    <div style={{fontSize: '12px'}}>
                      {plan.allergens?.length > 0 ? plan.allergens.join(', ') : 'లేవు'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    const rating = prompt('ఈ భోజనానికి రేటింగ్ ఇవ్వండి (1-5 నక్షత్రాలు):');
                    const comments = prompt('భోజనం గురించి ఏవైనా వ్యాఖ్యలు?');
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
                  ⭐ భోజనానికి రేటింగ్ ఇవ్వండి
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAssignmentsDetails = () => (
    <div style={mobileStyles.detailsContainer}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{color: '#2c3e50', marginBottom: '20px', textAlign: 'center'}}>
          📋 {language === 'telugu' ? 'పిల్లవాడి గృహపాఠాలు' : 'Child\'s Assignments'}
        </h3>
        
        {!assignments || assignments.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <div style={{color: '#7f8c8d', marginBottom: '20px'}}>
              {language === 'telugu' ? 'గృహపాఠాలు కనుగొనబడలేదు' : 'No assignments found'}
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
              {language === 'telugu' ? 'గృహపాఠాలను రిఫ్రెష్ చేయండి' : 'Refresh Assignments'}
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
                    backgroundColor: assignment.submission_status === 'submitted' ? '#d4edda' : assignment.submission_status === 'graded' ? '#cce5ff' : '#fff3cd',
                    color: assignment.submission_status === 'submitted' ? '#155724' : assignment.submission_status === 'graded' ? '#004085' : '#856404'
                  }}>
                    {language === 'telugu' ? 
                      (assignment.submission_status === 'submitted' ? 'సమర్పించబడింది' : 
                       assignment.submission_status === 'graded' ? 'గ్రేడ్ ఇవ్వబడింది' : 
                       assignment.submission_status === 'pending' ? 'వేచి ఉంది' : assignment.submission_status) :
                      assignment.submission_status
                    }
                  </div>
                </div>
                
                {assignment.student && (
                  <div style={{marginBottom: '10px'}}>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>
                      {language === 'telugu' ? 'విద్యార్థి' : 'Student'}
                    </div>
                    <div style={{fontWeight: 'bold'}}>{assignment.student.name} - {assignment.student.class}</div>
                  </div>
                )}
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>
                    {language === 'telugu' ? 'వివరణ' : 'Description'}
                  </div>
                  <div>{assignment.description}</div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>
                    {language === 'telugu' ? 'గడువు తేదీ' : 'Due Date'}
                  </div>
                  <div style={{fontWeight: 'bold', color: '#c0392b'}}>
                    {new Date(assignment.due_date).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                  <div style={{color: '#7f8c8d', fontSize: '14px'}}>
                    {language === 'telugu' ? 'రకం' : 'Type'}
                  </div>
                  <div>{assignment.assignment_type}</div>
                </div>
                
                {assignment.submitted_at && (
                  <div style={{marginBottom: '10px'}}>
                    <div style={{color: '#7f8c8d', fontSize: '14px'}}>
                      {language === 'telugu' ? 'సమర్పించిన తేదీ' : 'Submitted On'}
                    </div>
                    <div style={{color: '#27ae60', fontWeight: 'bold'}}>
                      {new Date(assignment.submitted_at).toLocaleString()}
                      {assignment.is_late && (
                        <span style={{color: '#e74c3c', marginLeft: '10px'}}>
                          ({language === 'telugu' ? 'ఆలస్యంగా' : 'Late'})
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {assignment.marks_obtained !== null && assignment.marks_obtained !== undefined && (
                  <div style={{
                    backgroundColor: '#e8f5e8',
                    padding: '12px',
                    borderRadius: '8px',
                    marginTop: '10px'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{fontSize: '16px', fontWeight: 'bold', color: '#27ae60'}}>
                        {language === 'telugu' ? 'మార్కులు పొందారు' : 'Marks Obtained'}: {assignment.marks_obtained}/{assignment.max_marks}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: assignment.marks_obtained >= (assignment.max_marks * 0.7) ? '#27ae60' : 
                               assignment.marks_obtained >= (assignment.max_marks * 0.5) ? '#f39c12' : '#e74c3c'
                      }}>
                        {Math.round((assignment.marks_obtained / assignment.max_marks) * 100)}%
                      </div>
                    </div>
                    {assignment.feedback && (
                      <div style={{marginTop: '8px'}}>
                        <div style={{color: '#7f8c8d', fontSize: '14px'}}>
                          {language === 'telugu' ? 'టీచర్ అభిప్రాయం' : 'Teacher Feedback'}
                        </div>
                        <div style={{fontStyle: 'italic', color: '#2c3e50'}}>{assignment.feedback}</div>
                      </div>
                    )}
                  </div>
                )}
                
                {assignment.submission_status === 'pending' && (
                  <div style={{
                    backgroundColor: '#fff3cd',
                    padding: '10px',
                    borderRadius: '8px',
                    marginTop: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{color: '#856404', fontSize: '14px'}}>
                      {language === 'telugu' ? 'గృహపాఠం ఇంకా సమర్పించబడలేదు' : 'Assignment not yet submitted'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={mobileStyles.container}>
      <div style={mobileStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left side - Parent icon and name */}
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
                {/* Parent Icon */}
                <img 
                  src={parentIcon} 
                  alt="Parent"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Parent Name */}
                <div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {language === 'english' ? 'Michael Smith' : 'మైఖేల్ స్మిత్'}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(55, 65, 81, 0.7)'
                  }}>
                    {language === 'english' ? 'Parent' : 'తల్లిదండ్రులు'}
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
          {texts.error}: {error}
        </div>
      )}

      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'attendance' && renderAttendanceDetails()}
      {currentView === 'marks' && renderMarksDetails()}
      {currentView === 'ptm' && renderPTMDetails()}
      {currentView === 'scholarships' && renderScholarshipsDetails()}
      {currentView === 'meals' && renderMealsDetails()}
      {currentView === 'assignments' && renderAssignmentsDetails()}
    </div>
  );
}
