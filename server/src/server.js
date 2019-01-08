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
    callbackURL: process.env.CALLBACK_URL
} 

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Allows the application to accept JSON and use passport
app.use(express.json());
app.use(passport.initialize());

// Set up cors to allow us to accept requests from our client
app.use(cors({
    origin: 'http://localhost:3000'
  })) 

// saveUninitialized: true allows us to attach the socket id
// to the session before we have authenticated with Twitter  
app.use(session({ 
    secret: 'myveryownsecret', 
    resave: true, 
    saveUninitialized: true 
  }))

  // allows us to save the user into the session
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

passport.use(new TwitterStrategy(TWITTER_CONFIG, (token, tokenSecret, profile, done) => {
    const user = { 
        name: profile.username,
        photo: profile.photos[0].value.replace(/_normal/, '')
    }
    console.log(user);
    done(null, user)
  })
)

// Middleware that triggers the PassportJS authentication process
const twitterAuth = passport.authenticate('twitter')


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

// This is endpoint triggered by the popup on the client which starts the whole
// authentication process
app.get('/twitter',
(req, res, next) => {
    req.session.socketId = req.query.socketId
    next() 
},  
    twitterAuth)

// This is the endpoint that Twitter sends the user information to. 
// The twitterAuth middleware attaches the user to req.user and then
// the user info is sent to the client via the socket id that is in the 
// session. 
app.get('/twitter/callback', passport.authenticate('twitter', { successRedirect: '/',
failureRedirect: '/hello' }), (req, res) => {
    io.in(req.session.socketId).emit('user', req.user)
    res.end()
  })

app.get('/', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});



server.listen(port, () => console.log(`Listening on port ${port}`));