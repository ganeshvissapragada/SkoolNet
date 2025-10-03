const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/schoolplatform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define the Attendance schema (matching the existing model)
const attendanceSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true }
}, { 
  timestamps: true,
  collection: 'attendances'
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

const sampleAttendanceData = [
  // Student 1 (assuming student IDs start from 1)
  { studentId: 1, date: new Date('2025-10-01'), status: 'Present' },
  { studentId: 1, date: new Date('2025-10-02'), status: 'Present' },
  { studentId: 1, date: new Date('2025-10-03'), status: 'Absent' },
  
  // Student 2
  { studentId: 2, date: new Date('2025-10-01'), status: 'Present' },
  { studentId: 2, date: new Date('2025-10-02'), status: 'Absent' },
  { studentId: 2, date: new Date('2025-10-03'), status: 'Present' },
  
  // Student 3
  { studentId: 3, date: new Date('2025-10-01'), status: 'Absent' },
  { studentId: 3, date: new Date('2025-10-02'), status: 'Present' },
  { studentId: 3, date: new Date('2025-10-03'), status: 'Present' },
  
  // Student 4
  { studentId: 4, date: new Date('2025-10-01'), status: 'Present' },
  { studentId: 4, date: new Date('2025-10-02'), status: 'Present' },
  { studentId: 4, date: new Date('2025-10-03'), status: 'Present' },
  
  // Add more recent dates
  { studentId: 1, date: new Date('2025-09-30'), status: 'Present' },
  { studentId: 2, date: new Date('2025-09-30'), status: 'Present' },
  { studentId: 3, date: new Date('2025-09-30'), status: 'Absent' },
  { studentId: 4, date: new Date('2025-09-30'), status: 'Present' },
  
  { studentId: 1, date: new Date('2025-09-29'), status: 'Absent' },
  { studentId: 2, date: new Date('2025-09-29'), status: 'Present' },
  { studentId: 3, date: new Date('2025-09-29'), status: 'Present' },
  { studentId: 4, date: new Date('2025-09-29'), status: 'Present' },
];

async function seedAttendanceData() {
  try {
    // Clear existing attendance data
    await Attendance.deleteMany({});
    console.log('🧹 Cleared existing attendance data');
    
    // Insert sample data
    await Attendance.insertMany(sampleAttendanceData);
    console.log('✅ Sample attendance data created successfully!');
    
    // Verify the data
    const count = await Attendance.countDocuments();
    console.log(`📊 Total attendance records: ${count}`);
    
    // Show some sample records
    const samples = await Attendance.find().limit(5).sort({ date: -1 });
    console.log('📝 Sample records:');
    samples.forEach(record => {
      console.log(`   Student ${record.studentId}: ${record.status} on ${record.date.toLocaleDateString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding attendance data:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedAttendanceData();
