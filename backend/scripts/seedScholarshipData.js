require('dotenv').config();
const { User, Scholarship, sequelize } = require('../models/postgres');
const connectMongo = require('../config/mongo');

async function seedScholarshipData() {
  try {
    await connectMongo();
    await sequelize.sync();

    console.log('Seeding scholarship data...');

    // Find an admin user to create scholarships
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      return;
    }

    // Create sample scholarships
    const scholarships = [
      {
        title: 'Academic Excellence Scholarship 2025',
        description: 'Rewarding students with outstanding academic performance and dedication to learning.',
        eligibility_criteria: 'Students with 90% or above average marks in the previous academic year. Must be enrolled in classes 10, 11, or 12. Family income should not exceed ₹5,00,000 per annum.',
        scholarship_amount: 50000,
        benefits: 'Free textbooks, stationery allowance of ₹5,000, and mentorship program access',
        required_documents: [
          'Academic Transcripts (last 2 years)',
          'Income Certificate',
          'Recommendation Letter from Class Teacher',
          'Personal Statement (500 words)',
          'Passport Size Photographs'
        ],
        application_deadline: new Date('2025-12-31'),
        contact_person: 'Dr. Priya Sharma',
        contact_email: 'scholarships@school.edu.in',
        contact_phone: '+91-9876543210',
        department: 'Academic Affairs',
        scholarship_type: 'merit',
        class_eligibility: ['10', '11', '12'],
        created_by: adminUser.id,
        application_start_date: new Date(),
        max_applications: 50
      },
      {
        title: 'Sports Achievement Award',
        description: 'Supporting talented athletes who excel in sports while maintaining academic standards.',
        eligibility_criteria: 'Students who have represented the school/district/state in any sport. Minimum 75% attendance and 70% academic performance required.',
        scholarship_amount: 25000,
        benefits: 'Sports equipment allowance, coaching support, and travel expenses for competitions',
        required_documents: [
          'Sports Achievement Certificates',
          'Academic Report Card',
          'Medical Fitness Certificate',
          'Coach Recommendation Letter',
          'Attendance Record'
        ],
        application_deadline: new Date('2025-11-15'),
        contact_person: 'Coach Rajesh Kumar',
        contact_email: 'sports@school.edu.in',
        contact_phone: '+91-9876543211',
        department: 'Sports Department',
        scholarship_type: 'sports',
        class_eligibility: ['9', '10', '11', '12'],
        created_by: adminUser.id,
        application_start_date: new Date(),
        max_applications: 20
      },
      {
        title: 'Need-Based Financial Support',
        description: 'Providing financial assistance to deserving students from economically disadvantaged backgrounds.',
        eligibility_criteria: 'Family income below ₹2,00,000 per annum. Student should maintain minimum 60% academic performance. Preference given to single-parent families or orphans.',
        scholarship_amount: 75000,
        benefits: 'Full fee waiver, uniform allowance, mid-day meal support, and transportation allowance',
        required_documents: [
          'Income Certificate (BPL Card/Salary Certificate)',
          'Academic Transcripts',
          'Family Composition Certificate',
          'Bank Account Details',
          'Domicile Certificate',
          'Social Worker Recommendation (if applicable)'
        ],
        application_deadline: new Date('2025-10-31'),
        contact_person: 'Ms. Anita Patel',
        contact_email: 'welfare@school.edu.in',
        contact_phone: '+91-9876543212',
        department: 'Student Welfare Office',
        scholarship_type: 'need_based',
        class_eligibility: ['6', '7', '8', '9', '10', '11', '12'],
        created_by: adminUser.id,
        application_start_date: new Date(),
        max_applications: 100
      },
      {
        title: 'Creative Arts Scholarship',
        description: 'Encouraging students with exceptional talent in music, dance, painting, or other creative arts.',
        eligibility_criteria: 'Students with proven talent in any creative art form. Must have participated in inter-school competitions or cultural events. Academic performance should be above 65%.',
        scholarship_amount: 30000,
        benefits: 'Art supplies, workshop participation fees, and exhibition/performance opportunities',
        required_documents: [
          'Portfolio/Performance Videos',
          'Art Teacher Recommendation',
          'Academic Report Card',
          'Competition Certificates',
          'Personal Creative Statement'
        ],
        application_deadline: new Date('2025-12-15'),
        contact_person: 'Ms. Kavitha Nair',
        contact_email: 'arts@school.edu.in',
        contact_phone: '+91-9876543213',
        department: 'Cultural Activities Department',
        scholarship_type: 'arts',
        class_eligibility: ['8', '9', '10', '11', '12'],
        created_by: adminUser.id,
        application_start_date: new Date(),
        max_applications: 15
      },
      {
        title: 'Girl Child Education Initiative',
        description: 'Special scholarship program to promote and support education of girl students.',
        eligibility_criteria: 'Female students with good academic record (above 75%). Family income below ₹4,00,000 per annum. Preference to first-generation learners.',
        scholarship_amount: 40000,
        benefits: 'Educational materials, safety kit, career counseling sessions, and leadership development programs',
        required_documents: [
          'Academic Transcripts',
          'Income Certificate',
          'Gender Certificate',
          'Guardian Consent Form',
          'Future Goals Essay (300 words)'
        ],
        application_deadline: new Date('2025-11-30'),
        contact_person: 'Dr. Sunita Reddy',
        contact_email: 'girlchild@school.edu.in',
        contact_phone: '+91-9876543214',
        department: 'Gender Equality Cell',
        scholarship_type: 'other',
        class_eligibility: ['9', '10', '11', '12'],
        created_by: adminUser.id,
        application_start_date: new Date(),
        max_applications: 30
      }
    ];

    // Create scholarships
    for (const scholarshipData of scholarships) {
      await Scholarship.create(scholarshipData);
      console.log(`✅ Created scholarship: ${scholarshipData.title}`);
    }

    console.log('\n🎉 Scholarship data seeded successfully!');
    console.log('\nCreated Scholarships:');
    scholarships.forEach((scholarship, index) => {
      console.log(`${index + 1}. ${scholarship.title} - ₹${scholarship.scholarship_amount.toLocaleString('en-IN')}`);
      console.log(`   Type: ${scholarship.scholarship_type}, Deadline: ${scholarship.application_deadline.toDateString()}`);
      console.log(`   Contact: ${scholarship.contact_person} (${scholarship.contact_email})\n`);
    });

  } catch (error) {
    console.error('Error seeding scholarship data:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedScholarshipData();
}

module.exports = { seedScholarshipData };
