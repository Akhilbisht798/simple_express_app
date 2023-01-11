#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Model = require("./models/model");
var Category = require("./models/category");


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var category = [];
var models = [];

function categoryCreate(name, description, cb) {
    categorydetail = { name: name, description: description }

    var newCategory = new Category(categorydetail);

    newCategory.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Category: ' + newCategory);
        category.push(newCategory)
        cb(null, newCategory)
    });
}

function modelCreate(name, description, inStock, price, category, cb) {
    modeldetail = {
        name: name,
        price: price,
        description: description,
        inStock: inStock,
        category: category,
    }

    var model = new Model(modeldetail);
    model.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Book: ' + model);
        models.push(model)
        cb(null, model)
    });
}

function createCategory(cb) {
    async.series([
        function (callback) {
            categoryCreate("Genral", "This is Category for Genral Daily use items", callback);
        },
        function (callback) {
            categoryCreate("Ration", "This Category is for rations", callback);
        },
        function (callback) {
            categoryCreate("Medical", "This Category is related to all Medical Supplies", callback);
        },
        function (callback) {
            categoryCreate("Snacks", "This Category is for Snacks and Other supplies", callback);
        },
    ],
        // optional callback
        cb);
}


function createModels(cb) {
    async.parallel([
        function (callback) {
            modelCreate("Dettol", "this is antiseptic used on injury", 100, 30, category[2], callback);
        },
        function (callback) {
            modelCreate("Rice", "Rice, a monocot, is normally grown as an annual plant, although in tropical areas", 30, 100, category[1], callback);
        },
        function (callback) {
            modelCreate("Soap", "bathing soap for men", 30, 10, category[0], callback);
        },
        function (callback) {
            modelCreate("Uncle Chips", "patato Chips", 30, 10, category[3], callback);
        },
    ],
        // optional callback
        cb);
}

async.series([
    createCategory,
    createModels
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log(`Populated Succesfully`);

        }
        // All done, disconnect from database
        mongoose.connection.close();
    });