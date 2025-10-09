const fs = require('fs');
const path = require('path');

// File path for persistent storage
const DATA_FILE_PATH = path.join(__dirname, '../data/landingPageData.json');

// Default data structure
const defaultLandingPageData = {
  schoolInfo: {
    name: 'ZPHS Pendyala',
    description: 'Nurturing young minds for a brighter tomorrow with excellence in education, character building, and holistic development. We are committed to providing world-class education that prepares students for future challenges while maintaining strong moral values and cultural heritage.',
    address: 'Pendyala Village, Guntur District, Andhra Pradesh - 522019',
    email: 'zphs.pendyala@education.ap.gov.in',
    phone: '+91-8632-245678',
    logo: null,
    backgroundImage: null
  },  stats: [
    {
      label: 'Student Strength',
      value: 2500,
      icon: '/assets/landingpage/student.png',
      description: 'Bright minds learning and growing with us',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      label: 'Teacher Strength',
      value: 150,
      icon: '/assets/landingpage/teacher.png',
      description: 'Experienced educators dedicated to excellence',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)'
    },
    {
      label: 'Smart Classrooms',
      value: 45,
      icon: '/assets/landingpage/classroom.png',
      description: 'Modern technology-enabled learning spaces',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    },
    {
      label: 'Years of Excellence',
      value: 25,
      icon: '/assets/landingpage/calendar.png',
      description: 'Serving the community since 1999 with dedication',
      gradient: 'linear-gradient(135deg, #ffd93d, #ff6b6b)'
    }
  ],
  teachers: [
    {
      id: 2,
      name: 'Mrs. Priya Sharma',
      position: 'Vice Principal',
      qualifications: 'M.Ed., B.Ed., M.A. English',
      experience: '15+ Years',
      photo: null,
      email: 'viceprincipal@excellenceschool.edu',
      phone: '+91-9876543211'
    },
    {
      id: 3,
      name: 'Prof. Suresh Mehta',
      position: 'Academic Director',
      qualifications: 'M.Sc. Physics, B.Ed., Ph.D.',
      experience: '18+ Years',
      photo: null,
      email: 'academic@excellenceschool.edu',
      phone: '+91-9876543212'
    },
    {
      id: 4,
      name: 'Mr. Arjun Singh',
      position: 'Sports Director',
      qualifications: 'M.P.Ed., B.P.Ed., Sports Coach',
      experience: '12+ Years',
      photo: null,
      email: 'sports@excellenceschool.edu',
      phone: '+91-9876543213'
    }
  ],
  albums: [
    {
      id: 1,
      title: 'Annual Sports Day 2024',
      description: 'Celebrating athletic excellence and team spirit with various sporting events, competitions, and award ceremonies',
      category: 'sports',
      date: '2024-03-15',
      coverImage: null,
      images: [],
      photoCount: 0
    },
    {
      id: 2,
      title: 'Science Exhibition 2024',
      description: 'Showcasing student innovations, experiments, and scientific discoveries across all grade levels',
      category: 'academic',
      date: '2024-02-20',
      coverImage: null,
      images: [],
      photoCount: 0
    },
    {
      id: 3,
      title: 'Cultural Festival 2024',
      description: 'Embracing diversity through arts, dance, music performances, and cultural celebrations',
      category: 'cultural',
      date: '2024-01-10',
      coverImage: null,
      images: [],
      photoCount: 0
    },
    {
      id: 4,
      title: 'Independence Day Celebration',
      description: 'Patriotic celebrations with flag hoisting, cultural programs, and student performances',
      category: 'events',
      date: '2024-08-15',
      coverImage: null,
      images: [],
      photoCount: 0
    },
    {
      id: 5,
      title: 'Inter-House Competition',
      description: 'Annual competition between school houses featuring academics, sports, and cultural events',
      category: 'sports',
      date: '2024-04-10',
      coverImage: null,
      images: [],
      photoCount: 0
    },
    {
      id: 6,
      title: 'Field Trip Adventures',
      description: 'Educational field trips to museums, historical sites, and science centers',
      category: 'academic',
      date: '2024-05-25',
      coverImage: null,
      images: [],
      photoCount: 0
    }
  ],
  carousel: [
    {
      id: 1,
      title: 'Welcome to Excellence Public School',
      subtitle: 'Nurturing Future Leaders with Excellence in Education',
      image: null
    },
    {
      id: 2,
      title: 'Academic Excellence',
      subtitle: 'Shaping Bright Minds for Tomorrow\'s Challenges',
      image: null
    },
    {
      id: 3,
      title: 'Sports & Activities',
      subtitle: 'Building Character Through Physical Excellence',
      image: null
    },
    {
      id: 4,
      title: 'Innovation & Technology',
      subtitle: 'Embracing Digital Learning for Future Success',
      image: null
    },
    {
      id: 5,
      title: 'Cultural Heritage',
      subtitle: 'Preserving Traditions While Embracing Modernity',
      image: null
    }
  ]
};

// Function to save data to file
const saveDataToFile = () => {
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(landingPageData, null, 2));
    console.log('Landing page data saved to file');
  } catch (error) {
    console.error('Error saving landing page data:', error);
  }
};

// Function to load data from file
const loadDataFromFile = () => {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const parsedData = JSON.parse(fileData);
      
      // Merge with default data to ensure all required fields exist
      Object.keys(defaultLandingPageData).forEach(key => {
        if (parsedData[key] !== undefined) {
          landingPageData[key] = parsedData[key];
        }
      });
      
      console.log('Landing page data loaded from file');
      return true;
    }
  } catch (error) {
    console.error('Error loading landing page data:', error);
  }
  console.log('Using default landing page data');
  return false;
};

// Initialize data from file on startup
let landingPageData = { ...defaultLandingPageData };
loadDataFromFile();

// Export data and utility functions
module.exports = {
  get data() { return landingPageData; },
  saveDataToFile,
  loadDataFromFile
};
