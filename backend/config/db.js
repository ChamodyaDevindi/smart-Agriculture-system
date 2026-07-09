const mongoose = require('mongoose');
const dbHelper = require('./dbHelper');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    mongoose.set('strictQuery', false);
    
    // Attempt connection with a short timeout (3 seconds)
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-agriculture', {
      serverSelectionTimeoutMS: 3000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    dbHelper.setMongoConnected(true);
    
    // Seed MongoDB
    await seedMarketPrices();
  } catch (error) {
    console.warn(`\n⚠️ MongoDB connection failed: ${error.message}`);
    console.warn('⚠️ Falling back to Local JSON database. App will remain fully functional!\n');
    dbHelper.setMongoConnected(false);
    
    // Seed JSON fallback
    await seedJSONPrices();
  }
};

const seedMarketPrices = async () => {
  try {
    const MarketPrice = mongoose.model('MarketPrice');
    const count = await MarketPrice.countDocuments();
    if (count === 0) {
      console.log('Seeding default market prices in MongoDB...');
      const today = new Date().toISOString().split('T')[0];
      const defaultPrices = [
        { crop: 'Tomato', price: 250, date: today },
        { crop: 'Carrot', price: 180, date: today },
        { crop: 'Potato', price: 150, date: today },
        { crop: 'Onion', price: 210, date: today },
        { crop: 'Chili', price: 420, date: today },
        { crop: 'Brinjal', price: 160, date: today },
        { crop: 'Cabbage', price: 130, date: today }
      ];
      await MarketPrice.insertMany(defaultPrices);
      console.log('Seeded MongoDB market prices successfully.');
    }
  } catch (err) {
    console.error('Error seeding MongoDB market prices:', err.message);
  }
};

const seedJSONPrices = async () => {
  try {
    const count = await dbHelper.countDocuments('MarketPrice');
    if (count === 0) {
      console.log('Seeding default market prices in Local JSON Database...');
      const today = new Date().toISOString().split('T')[0];
      const defaultPrices = [
        { crop: 'Tomato', price: 250, date: today },
        { crop: 'Carrot', price: 180, date: today },
        { crop: 'Potato', price: 150, date: today },
        { crop: 'Onion', price: 210, date: today },
        { crop: 'Chili', price: 420, date: today },
        { crop: 'Brinjal', price: 160, date: today },
        { crop: 'Cabbage', price: 130, date: today }
      ];
      await dbHelper.insertMany('MarketPrice', defaultPrices);
      console.log('Seeded Local JSON market prices successfully.');
    }
  } catch (err) {
    console.error('Error seeding Local JSON market prices:', err.message);
  }
};

module.exports = connectDB;
