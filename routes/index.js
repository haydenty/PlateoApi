var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var users = require('./users.js');
var plates = require('./plates.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', auth.register);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/users', users.getAllUsers);
//router.get('/api/v1/users/:id', users.getFriends);

router.post('/api/v1/plates/', plates.createPlate);
router.get('/api/v1/plates/', plates.getAllPlates);
router.get('/api/v1/plates/:id', plates.getPlatesForUser);

module.exports = router;
