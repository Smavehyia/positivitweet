const path = require('path');

const callbackURL =  process.env.CALLBACK_URL
  ? process.env.CALLBACK_URL
  : 'http://127.0.0.1:8080/twitter/callback';
/* const TwitterConfig = {
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL
} */

const filePath = path.resolve(process.cwd(), '.env')

require('dotenv').config({ path: filePath })