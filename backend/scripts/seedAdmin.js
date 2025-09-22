require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models/postgres');

(async () => {
  try {
    await sequelize.sync();
    const email = 'admin@example.com';
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    const password = await bcrypt.hash('Admin@123', 10);
    const user = await User.create({
      name: 'Super Admin',
      email,
      password,
      role: 'admin'
    });
    console.log('Seeded admin:', { id: user.id, email: user.email });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();