require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectMongo = require('./config/mongo');
const { sequelize } = require('./models/postgres');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const parentRoutes = require('./routes/parent');
const studentRoutes = require('./routes/student');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/parent', parentRoutes);
app.use('/student', studentRoutes);

// Serve static files from React build (for production)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all handler: send back React's index.html file for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectMongo();
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
    }
    app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();