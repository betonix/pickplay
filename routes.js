var db = require('./db.js');
//var config = require('./oauth.js');
var User = require('./user.js');
var socket = require('./socketEvents.js').socket();

module.exports = function (app,passport,io){	
	
	
	app.get('/', function (req, res) {		
		
		require('/.socketEvents.js').updateSocketUser(req,socket,db);
		
		res.render('home')		
		
	});
	
	app.get('/auth/facebook',passport.authenticate('facebook'),function(req, res){
		
	});
	
	app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/' }),function(req, res) {
		res.redirect('/');
	});
	
	app.get('/roomplay', function (req, res) {
		
		require('/.socketEvents.js').updateSocketUser(req,socket,db);

		if(req.user!=undefined){
			name = req.user.facebook_name;
		}else{
			name = 'guest';
		}
			res.render('roomPlay',{
			user : name// get the user out of session and pass to template
		});	
		
		
	});
	
	
}

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}