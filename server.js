var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var session = require('express-session');

app.use(session({secret: 'twittertesting123'}));
var passport = require('passport');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.get('/', function(request, response) {
   response.render('index.ejs');
});

app.get('/profile', function(request, response) {
    // HACK Using user object from inside passport
    // var user = JSON.parse(request.session.passport.user);
    // var id = user.id;
    // var token = user.token;
    // var username = user.username;
    // var displayName = user.displayName;
    // END HACK
    var id = request.session.id;
    var token = request.session.token;
    var username = request.session.username;
    var displayName = request.session.displayName;
    response.render('profile.ejs', {'id': id, 'username': username, 'displayName': displayName, 'token': token});
});

// send to facebook to do the authentication
// app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
app.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after facebook has authenticated the user
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

app.listen(port, function(){
    console.log("Listening to port " + port);
});