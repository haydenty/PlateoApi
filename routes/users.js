var MongoClient = require('mongodb').MongoClient;
var constants = require('../plateoApi/constants.js');

var users = {
    getAllUsers: function(req, res) {
        MongoClient.connect(constants.dbConnection, function(err, db) {
            if (!err) {
                var collection = db.collection('users');
                collection.find().toArray(function(error, users) {
                    if (!error) {
                        res.json(users);
                    } else {
                        res.status(401);
                        res.json({
                            status: 401,
                            message: 'We messed up trying to get all the users.',
                            errors: error
                        });
                    }
                    db.close();
                });
            } else {
                res.status(401);
                res.json({
                    status: 401,
                    message: 'Database connection issues, sorry try again.',
                    errors: err
                });
            }
        });
    },
    getFriends: function(req, res) {
        res.json([{
            name: 'Martha'
        }, {
            name: 'Sammy'
        }]);
    },
    createUser: function(req, callback) {
        this.doesUsernameExist(req.username, function(resp) {
            //pass the errors up the chain
            // if (resp.errors !== undefined || resp.errors !== null) {
            //     console.log('errors in createUser: ', JSON.stringify(resp.errors));
            //     res.status(401);
            //     res.errors = resp.errors; //May get overriden from below
            // }
            if (!resp.doesExist) {
                var user = {
                    username: req.username,
                    email: req.email,
                    password: req.pass
                };
                MongoClient.connect(constants.dbConnection, function(err, db) {
                    if (!err) {
                        var collection = db.collection('users');
                        collection.insert(user, function(error, result) {
                            if (error !== null) {
                                callback({
                                    status: 401,
                                    message: 'We messed up trying to create the user account.',
                                    errors: error
                                });
                            } else {
                                callback({
                                    userId: result.ops[0]._id
                                });
                            }
                            db.close();
                        });
                    } else {
                        callback({
                            status: 401,
                            message: 'Database connection issues, sorry try again.',
                            errors: err
                        });
                    }
                });
            } else {
                callback({
                    status: 401,
                    message: 'Username is not unique.'
                });
            }
        });
    },
    doesUsernameExist: function(inUsername, callback) {
        MongoClient.connect(constants.dbConnection, function(err, db) {
            if (!err) {
                var collection = db.collection('users');
                var query = {
                    username: {
                        $eq: inUsername
                    }
                };
                collection.find(query).toArray(function(error, users) {
                    if (!error) {
                        if (users.length === 0) {
                            callback({
                                doesExist: false,
                                message: 'The given username is unique.'
                            });
                        } else {
                            callback({
                                doesExist: true,
                                message: 'A user already exists with that username.',
                                errors: error
                            });
                        }
                    } else {
                        callback({
                            isUnique: false,
                            message: 'We made a mistake in checking for unique username, sorry try again.',
                            errors: err
                        });
                    }
                    db.close();
                });
            } else {
                callback({
                    isUnique: false,
                    message: 'Database connection issues, sorry try again.',
                    errors: err
                });
            }
        });
    }
};

module.exports = users;
