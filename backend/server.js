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
const publicRoutes = require('./routes/public');

const app = express();
app.use(cors());
app.use(express.json());

// Logging middleware to debug route handling order
app.use((req, res, next) => {
  console.log('INCOMING:', req.method, req.path);
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/parent', parentRoutes);
app.use('/student', studentRoutes);
app.use('/api', publicRoutes);

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    // Try to connect to MongoDB, but don't fail if it's not available
    try {
      await connectMongo();
    } catch (mongoErr) {
      console.warn('MongoDB connection failed, continuing without MongoDB:', mongoErr.message);
    }
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
    }
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend listening on :${PORT} (all interfaces)`));

    // Serve static files from React build (for production) only for non-API routes
    app.use((req, res, next) => {
      const excluded = ['/api', '/uploads', '/auth', '/admin', '/teacher', '/parent', '/student'];
      if (excluded.some(prefix => req.path.startsWith(prefix))) {
        return next();
      }
      express.static(path.join(__dirname, '../frontend/dist'))(req, res, next);
    });

    // Catch-all handler: send back React's index.html file for all non-API/static routes
    app.get('*', (req, res, next) => {
      const excluded = [
        '/api', '/uploads', '/auth', '/admin', '/teacher', '/parent', '/student'
      ];
      if (excluded.some(prefix => req.path.startsWith(prefix))) {
        return next();
      }
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();