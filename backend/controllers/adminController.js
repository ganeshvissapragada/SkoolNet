const bcrypt = require('bcryptjs');
const { User, Student } = require('../models/postgres');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, student } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password, role required' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const created = await User.create({ name, email, password: hashed, role });

    let studentRow = null;
    if (role === 'student') {
      const { class: cls, section, parent_id } = student || {};
      studentRow = await Student.create({
        name,
        class: cls || null,
        section: section || null,
        parent_id: parent_id || null
      });
    }
    res.status(201).json({ user: { id: created.id, name, email, role }, student: studentRow });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: e.message });
  }
};