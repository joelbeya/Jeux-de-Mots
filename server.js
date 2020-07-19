//Install express server
const express = require('express');
const path = require('path');
const http = require('http');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');

const app = express();

//Enable bodyParser
app.use(cors());
app.use(bodyParser.json());
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.text({ type: 'text' }));
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
 next();
});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/jeux-de-mots-aigle'));
// if (process.env.NODE_ENV === "production"){
// app.use(favicon(path.join(__dirname+'/dist/jeux-de-mots-aigle/favicon.ico')));
// }
// if (process.env.NODE_ENV === "production"){
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'/dist/jeux-de-mots-aigle/index.html'));
  });
// }

// Start the app by listening on the default Heroku port
const port = process.env.PORT || '3333';
app.set('port', port);
const researchRoutes = require('./routes/research_routes.js');
app.use('', researchRoutes);
app.listen(port, () => console.log(`API running on localhost:${port}`));
