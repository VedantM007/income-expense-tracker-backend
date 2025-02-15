const moongoose = require('mongoose');
const env = require('../environments/dev.env');

const connectDB = async () => {
    const mongoURI = env.mongoDbConnectionString;
    try {
        await moongoose.connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
      } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
      }
};
module.exports = connectDB;