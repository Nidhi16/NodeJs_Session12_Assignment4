// load all the things we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');

var session = require('express-session');
app.use(session({secret: 'twittertesting123'}));  // session secret

app.use(passport.initialize());
app.use(passport.session());  // persistent login sessions

require('./config/passport')(passport);  // pass passport for configuration

app.set('view engine', 'ejs');  // set up ejs for templating

// route for home page
app.get('/', function(request, response) {
   response.render('index.ejs');
});

// route for showing the profile page
app.get('/profile', function(request, response) {
    // get the user out of session and pass to template
    var id = request.session.id;
    var token = request.session.token;
    var username = request.session.username;
    var displayName = request.session.displayName;
    response.render('profile.ejs', {'id': id, 'username': username, 'displayName': displayName, 'token': token});
});

// send to twitter to do the authentication
app.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

// launch
console.log("Please open the server on http://127.0.0.1:8080, do not use 'localhost'");
app.listen(port, function(){
    console.log("Listening to port " + port);
});