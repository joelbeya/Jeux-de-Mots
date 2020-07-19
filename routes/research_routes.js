const express = require('express');
var cookieSession = require('cookie-session');
const router = express.Router();
const researchController = require('../controllers/research_controller.js');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
// router.set('trust proxy', 1) // trust first proxy
router.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// parse various different custom JSON types as JSON
router.use(bodyParser.json({ type: 'application/*+json' }))
// parse some custom thing into a Buffer
router.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
router.use(bodyParser.text({ type: 'text/html' }));
router.use(bodyParser.text({ type: 'text' }));

var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.post('', urlencodedParser, researchController.search);

module.exports = router;
