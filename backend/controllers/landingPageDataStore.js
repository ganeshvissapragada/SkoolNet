// Shared in-memory landing page data store
const landingPageData = {
  schoolInfo: {
    name: 'Excellence Public School',
    description: 'Nurturing young minds for a brighter tomorrow with excellence in education, character building, and holistic development. We are committed to providing world-class education that prepares students for future challenges while maintaining strong moral values and cultural heritage.',
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
  ],
  achievements: [
    {
      id: 1,
      title: 'State Board Topper',
      description: 'Our student Rajesh Kumar secured 1st rank in State Board examinations with 98.5% marks, making the entire school proud',
      year: '2024',
      category: 'Academic',
      rank: '#1 State Rank',
      icon: '🏆'
    },
    {
      id: 2,
      title: 'National Science Olympiad',
      description: 'Gold medal in National Science Olympiad competition representing our state with exceptional performance in physics and chemistry',
      year: '2024',
      category: 'Academic',
      rank: 'Gold Medal',
      icon: '🥇'
    },
    {
      id: 3,
      title: 'Inter-School Football Championship',
      description: 'Champions in District Inter-School Football Tournament for consecutive 3 years, showcasing exceptional teamwork and sportsmanship',
      year: '2024',
      category: 'Sports',
      rank: 'Champions',
      icon: '⚽'
    },
    {
      id: 4,
      title: 'Best School Award',
      description: 'Recognized as the Best School in the district by State Education Department for overall excellence in academics and infrastructure',
      year: '2024',
      category: 'Recognition',
      rank: 'Best School',
      icon: '🏫'
    },
    {
      id: 5,
      title: 'International Mathematics Olympiad',
      description: 'Silver medal in International Mathematics Olympiad by our class 10 student Priya Sharma, competing with 50+ countries',
      year: '2024',
      category: 'Academic',
      rank: 'Silver Medal',
      icon: '🧮'
    },
    {
      id: 6,
      title: 'State Cultural Festival Winners',
      description: 'First place in State Level Cultural Festival with outstanding classical dance and traditional music performances',
      year: '2024',
      category: 'Cultural',
      rank: '1st Place',
      icon: '🎭'
    },
    {
      id: 7,
      title: 'Green School Certification',
      description: 'Awarded Green School Certification for outstanding environmental initiatives, solar power adoption, and sustainability practices',
      year: '2023',
      category: 'Environmental',
      rank: 'Certified',
      icon: '🌱'
    },
    {
      id: 8,
      title: 'State Athletics Championship',
      description: 'Multiple medals in State Athletics Championship including 100m sprint record and long jump district record by our students',
      year: '2024',
      category: 'Sports',
      rank: 'Multiple Records',
      icon: '🏃‍♂️'
    },
    {
      id: 9,
      title: 'Inter-State Debate Competition',
      description: 'Won Inter-State Debate Competition on "Digital India and Future Education" showcasing exceptional oratory skills',
      year: '2024',
      category: 'Cultural',
      rank: 'Winners',
      icon: '🎤'
    },
    {
      id: 10,
      title: 'Community Service Excellence',
      description: 'Completed 5000+ hours of community service including COVID relief, environmental cleanup, and elderly care programs',
      year: '2023-2024',
      category: 'Community',
      rank: '5000+ Hours',
      icon: '🤝'
    },
    {
      id: 11,
      title: 'Innovation in Education Award',
      description: 'Awarded by State Government for implementing innovative teaching methods, AI-based learning, and digital classroom initiatives',
      year: '2024',
      category: 'Innovation',
      rank: 'Excellence Award',
      icon: '💡'
    },
    {
      id: 12,
      title: 'District Chess Championship',
      description: 'District Chess Championship winners with our students securing top 3 positions and representing state at national level',
      year: '2024',
      category: 'Sports',
      rank: 'Top 3 Sweep',
      icon: '♟️'
    },
    {
      id: 13,
      title: 'National Art Competition',
      description: 'First prize in National Level Art Competition for painting on "Unity in Diversity" theme by class 8 student',
      year: '2024',
      category: 'Cultural',
      rank: '1st Prize',
      icon: '🎨'
    },
    {
      id: 14,
      title: 'Robotics Competition Victory',
      description: 'Won State Level Robotics Competition with innovative AI-powered cleaning robot designed by our computer science students',
      year: '2024',
      category: 'Innovation',
      rank: 'State Champions',
      icon: '🤖'
    },
    {
      id: 15,
      title: 'Literary Excellence Award',
      description: 'School magazine "Young Voices" won State Award for Best School Publication with creative writing and journalism',
      year: '2024',
      category: 'Academic',
      rank: 'Best Publication',
      icon: '📚'
    },
    {
      id: 16,
      title: 'Swimming Championship',
      description: 'District Swimming Championship with multiple gold medals in freestyle, butterfly, and relay events',
      year: '2024',
      category: 'Sports',
      rank: 'Multiple Golds',
      icon: '🏊‍♀️'
    },
    {
      id: 17,
      title: 'UNESCO Associated Schools Recognition',
      description: 'Selected as UNESCO Associated School for promoting peace education, international cooperation, and sustainable development',
      year: '2024',
      category: 'Recognition',
      rank: 'UNESCO Associated',
      icon: '🌍'
    },
    {
      id: 18,
      title: 'Science Fair Innovation',
      description: 'National Science Fair winner for developing low-cost water purification system using locally available materials',
      year: '2024',
      category: 'Innovation',
      rank: 'National Winner',
      icon: '🔬'
    },
    {
      id: 19,
      title: 'Perfect Attendance Recognition',
      description: 'Achieved 99.5% student attendance rate, highest in the district, recognized by Education Department',
      year: '2024',
      category: 'Recognition',
      rank: 'District Best',
      icon: '📅'
    },
    {
      id: 20,
      title: 'Digital Learning Excellence',
      description: 'Awarded for successful implementation of digital classrooms, online learning platforms, and technology integration',
      year: '2024',
      category: 'Innovation',
      rank: 'Excellence Award',
      icon: '💻'
    }
  ],
};

module.exports = landingPageData;
