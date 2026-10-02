const serverless = require('serverless-http');
const connectDB = require('./config/db');
const app = require('./app');

const serverlessApp = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectDB();

  return serverlessApp(event, context);
};