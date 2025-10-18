const { Sequelize } = require('sequelize');

// Try connection string approach first, fall back to individual env vars
const getDatabaseConfig = () => {
  // Option 1: Use DATABASE_URL if available
  if (process.env.DATABASE_URL) {
    console.log('📡 Using DATABASE_URL connection string');
    return {
      url: process.env.DATABASE_URL,
      options: {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'production' ? false : console.log,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    };
  }

  // Option 2: Use individual environment variables
  console.log('🔧 Using individual environment variables');
  return {
    url: null,
    options: {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT || 5432,
      database: process.env.PG_DB,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'production' ? false : console.log,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  };
};

const config = getDatabaseConfig();

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config.options);
} else {
  sequelize = new Sequelize(config.options);
}

// Test connection on startup
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully');
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err.message);
    console.error('🔧 Please check your database configuration in .env file');
  });

module.exports = sequelize;
