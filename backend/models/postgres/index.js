const sequelize = require('../../config/postgres');
const { DataTypes } = require('sequelize');

// Import meal system models
const MealPlan = require('./mealPlan');
const InventoryItem = require('./inventoryItem');
const MealConsumption = require('./mealConsumption');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'teacher', 'parent', 'student'), allowNull: false }
});

const Class = sequelize.define('Class', {
  class_name: DataTypes.STRING,
  section: DataTypes.STRING
});

const Subject = sequelize.define('Subject', {
  name: DataTypes.STRING
});

Subject.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Subject, { foreignKey: 'class_id' });

const Student = sequelize.define('Student', {
  name: DataTypes.STRING,
  class: DataTypes.STRING,
  section: DataTypes.STRING,
  parent_id: { type: DataTypes.INTEGER, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true }
});

const PTM = sequelize.define('PTM', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  meeting_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  meeting_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  agenda: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  location: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ptms',
  timestamps: true
});

// Define associations - Student-User relationships
Student.belongsTo(User, { as: 'parent', foreignKey: 'parent_id' });
Student.belongsTo(User, { as: 'student_user', foreignKey: 'user_id' });
User.hasMany(Student, { as: 'children', foreignKey: 'parent_id' });
User.hasOne(Student, { as: 'studentRecord', foreignKey: 'user_id' });

const Scholarship = sequelize.define('Scholarship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  eligibility_criteria: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  scholarship_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  benefits: {
    type: DataTypes.TEXT
  },
  required_documents: {
    type: DataTypes.JSON,
    allowNull: false
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  contact_person: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contact_phone: {
    type: DataTypes.STRING
  },
  department: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired'),
    defaultValue: 'active'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  application_start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  max_applications: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  scholarship_type: {
    type: DataTypes.ENUM('merit', 'need_based', 'sports', 'arts', 'minority', 'other'),
    defaultValue: 'merit'
  },
  class_eligibility: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'scholarships',
  timestamps: true
});

// PTM associations - use unique aliases for PTM-specific relationships  
PTM.belongsTo(User, { as: 'teacher', foreignKey: 'teacher_id' });
PTM.belongsTo(User, { as: 'ptm_parent', foreignKey: 'parent_id' });
PTM.belongsTo(Student, { as: 'student', foreignKey: 'student_id' });

User.hasMany(PTM, { as: 'teacher_meetings', foreignKey: 'teacher_id' });
User.hasMany(PTM, { as: 'parent_meetings', foreignKey: 'parent_id' });
Student.hasMany(PTM, { as: 'meetings', foreignKey: 'student_id' });

// Scholarship associations
Scholarship.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(Scholarship, { as: 'created_scholarships', foreignKey: 'created_by' });

// Meal system associations
MealPlan.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(MealPlan, { as: 'created_meal_plans', foreignKey: 'created_by' });

MealConsumption.belongsTo(MealPlan, { as: 'meal_plan', foreignKey: 'meal_plan_id' });
MealConsumption.belongsTo(Student, { as: 'student', foreignKey: 'student_id' });
MealConsumption.belongsTo(User, { as: 'marked_by_user', foreignKey: 'marked_by' });

MealPlan.hasMany(MealConsumption, { as: 'consumptions', foreignKey: 'meal_plan_id' });
Student.hasMany(MealConsumption, { as: 'meal_consumptions', foreignKey: 'student_id' });
User.hasMany(MealConsumption, { as: 'marked_consumptions', foreignKey: 'marked_by' });

module.exports = {
  sequelize,
  User,
  Student,
  Class,
  Subject,
  PTM,
  Scholarship,
  MealPlan,
  InventoryItem,
  MealConsumption
};