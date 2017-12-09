// load all the things we need
var express  = require('express');
var app      = express();

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user));
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, {
            id: id
        });
    });

    passport.use(new TwitterStrategy({
        'consumerKey': "ZXEmk8lCUMYK0Nm5dgNs2ch2G",
        'consumerSecret': "vmsZtRtoTktB8COJbTadXB76WjvBBorBrt2Z4MsckS2wrV91IQ",
        'callbackURL': "http://127.0.0.1:8080/auth/twitter/callback",
        'passReqToCallback' : true
    },
    function (request, token, tokenSecret, profile, done) {
        console.log(profile);
        // set all of the relevant information
        var sessionData = request.session;
        sessionData.id = profile.id;
        sessionData.token = token;
        sessionData.username = profile.username;
        sessionData.displayName = profile.displayName;
        done(null, {
            id: profile.id,
            token: token,
            username: profile.username,
            displayName: profile.displayName
        });
    }
    ));
};