var db = require('./db.js');
//var config = require('./oauth.js');
var User = require('./user.js');
var socket = require('./socketEvents.js').socket();
//require('./ioEvents.js')(socket);


module.exports = function (app,passport,io){	
	
	
	app.get('/', function (req, res) {	
	
		req.session.userId = 254
		
		//util.updateSocketUser(req,socket,db);	
		res.render('home')		
		
	});
	
	app.get('/auth/facebook',passport.authenticate('facebook'),function(req, res){
		
	});
	
	app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/' }),function(req, res) {
		res.redirect('/');
	});
	
	app.get('/roomplay/:room', function (req, res) {
		
		room = req.params.room
		o = new Object();
		
		req.session.userId = 254
		
		o.name = "guest";
		o.points = 35;


		//util.joinRoom(o,room,socket,db,function(){
			
			
		//});
				
		console.log(socket)
		
		if(req.user!=undefined){
			name = req.user.facebook_name;
		}else{
			name = 'guest';
		}
			res.render('roomPlay',{
			user : name
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