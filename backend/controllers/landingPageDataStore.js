// Shared in-memory landing page data store
const landingPageData = {
  schoolInfo: {
    name: 'Excellence Public School',
    description: 'Nurturing young minds for a brighter tomorrow with excellence in education, character building, and holistic development.',
    logo: null,
    backgroundImage: null
  },
  stats: [
    { label: 'Students', value: 2500, icon: 'users' },
    { label: 'Teachers', value: 150, icon: 'users' },
    { label: 'Years of Excellence', value: 25, icon: 'award' },
    { label: 'Achievements', value: 45, icon: 'trophy' }
  ],
  teachers: [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      position: 'Principal',
      qualifications: 'Ph.D. in Education, M.Ed.',
      photo: null
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      position: 'Vice Principal',
      qualifications: 'M.A. in Mathematics, B.Ed.',
      photo: null
    },
    {
      id: 3,
      name: 'Mrs. Emily Davis',
      position: 'Head of Science Department',
      qualifications: 'M.Sc. in Physics, B.Ed.',
      photo: null
    }
  ],
  albums: [
    {
      id: 1,
      title: 'Annual Sports Day 2024',
      description: 'Celebrating athletic excellence and team spirit',
      coverImage: null
    },
    {
      id: 2,
      title: 'Science Exhibition',
      description: 'Showcasing student innovations and discoveries',
      coverImage: null
    },
    {
      id: 3,
      title: 'Cultural Festival',
      description: 'Embracing diversity through arts and performances',
      coverImage: null
    }
  ],
  carousel: [
    {
      id: 1,
      title: 'Welcome to Excellence Public School',
      subtitle: 'Nurturing Future Leaders',
      image: null
    },
    {
      id: 2,
      title: 'Academic Excellence',
      subtitle: 'Shaping Bright Minds',
      image: null
    },
    {
      id: 3,
      title: 'Sports & Activities',
      subtitle: 'Building Character',
      image: null
    }
  ]
};

module.exports = landingPageData;
