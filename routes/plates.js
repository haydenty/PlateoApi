var MongoClient = require('mongodb').MongoClient;
var constants = require('../plateoApi/constants.js');

var plates = {
        createPlate: function(req, res) {
            MongoClient.connect(constants.dbConnection, function(err, db) {
              var collection = db.collection('plates');
                if (!err) {
                    collection.insert(req.body, function(error, result) { //example of db error handling
                        if (error) {
                            res.status(401);
                            res.json({
                                status: 401,
                                message: 'We messed up trying to create your drop, sorry try again.',
                                errors: error
                            });
                        } else {
                            res.json({});
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
        getAllPlates: function(req, res) {
            MongoClient.connect(constants.dbConnection, function(err, db) {
              var collection = db.collection('plates');
                if (!err) {
                    collection.find().toArray(function(error, plates) {
                        if (!error) {
                            res.json(plates);
                        } else {
                            res.status(401);
                            res.json({
                                status: 401,
                                message: 'We messed up trying to get all the plates.',
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
        getPlatesForUser: function(req, res) {
            //TODO: privacy- should these be public always
            var userId = req.params.id;
            MongoClient.connect(constants.dbConnection, function(err, db) {
              var collection = db.collection('plates');
                    if (!err) {
                        var query = {
                            _id: {
                                $eq: userId
                            }
                        };
                        collection.find(query).toArray(function(error, plates) {
                            if (!error) {
                                res.json(plates);
                            } else {
                                res.status(401);
                                res.json({
                                    status: 401,
                                    message: 'We messed up trying to get all the plates for that user.',
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
        }
      };
        module.exports = plates;
