const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('MONGO_URI is not defined in environment variables');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please ensure:');
    console.error('1. MongoDB is running on your system');
    console.error('2. MONGO_URI in .env is correct (e.g., mongodb://localhost:27017/discover-bharat)');
    console.error('3. MongoDB service is started (check with: net start MongoDB)');
    process.exit(1);
  }
};

module.exports = connectDB;


