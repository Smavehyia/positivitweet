const express = require('express');
const http = require('http');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const TwitterStrategy = require('passport-twitter').Strategy
const TWITTER_CONFIG = {
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: "localhost:3000/twitter/callback"
} 

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    const path = require('path');
    const root = path.join(__dirname, '../../client/build');
    app.use(express.static(root));
  
    // Express serve up index.html file if it doesn't recognize route
    app.use((req, res, next) => {
        if (req.method === 'GET' && req.accepts('html') && !req.is('json') && !req.path.includes('.')) {
           res.sendFile('index.html', { root });
        } else next();
      });
}
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});



server.listen(port, () => console.log(`Listening on port ${port}`));