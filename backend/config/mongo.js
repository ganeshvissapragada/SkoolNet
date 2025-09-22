const mongoose = require('mongoose');

module.exports = async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set');
  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB || undefined
  });
  console.log('Connected to MongoDB');
};