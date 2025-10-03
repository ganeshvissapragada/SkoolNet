require('dotenv').config();
const { sequelize } = require('../models/postgres');

const createTeacherAssignmentsTable = async () => {
  try {
    // Drop the table if it exists
    await sequelize.query('DROP TABLE IF EXISTS teacher_assignments');
    
    // Create the table with all columns
    await sequelize.query(`
      CREATE TABLE teacher_assignments (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
        class_id INTEGER NOT NULL REFERENCES "Classes"(id) ON DELETE CASCADE,
        subject_id INTEGER NOT NULL REFERENCES "Subjects"(id) ON DELETE CASCADE,
        academic_year VARCHAR(255) DEFAULT '${new Date().getFullYear()}',
        is_active BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        UNIQUE(teacher_id, class_id, subject_id, academic_year)
      )
    `);
    
    console.log('✅ teacher_assignments table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating teacher_assignments table:', error);
    process.exit(1);
  }
};

createTeacherAssignmentsTable();
