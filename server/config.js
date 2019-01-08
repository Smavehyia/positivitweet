const path = require('path');

const callbackURL =  process.env.CALLBACK_URL
  ? process.env.CALLBACK_URL
  : 'http://localhost:5000/twitter/callback';

const filePath = path.resolve(process.cwd(), '.env')

require('dotenv').config({ path: filePath })