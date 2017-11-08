var db = require('./db.js');
//var config = require('./oauth.js');
var User = require('./user.js');
var socket = require('./socketEvents.js').socket();
//require('./ioEvents.js')(socket);


module.exports = function (app,passport,io){	
	
	
	app.get('/', function (req, res) {	
		
		if(req.user!=undefined){
			req.session.user = req.user;
			
		}else{
			req.session.user = {name:'guest'}
		}
		
		res.render('home')		
		
	});
	
	app.get('/auth/facebook',passport.authenticate('facebook'),function(req, res){
		
	});
	
	app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/' }),function(req, res) {
		res.redirect('/');
	});
	
	app.get('/roomplay/:room', function (req, res) {
		
		room = req.params.room
		user={};
		user.name = 'guest'			
		user.room = room;		
		var collection = db.get().collection('rooms');
		numeroPlay = 0;
		collection.find({room:room}).toArray(function(err, result){

			if(req.user!=undefined){
				
			user.name = req.user.facebook_name;
			user.facebook_id = req.user.facebook_id;
			user.facebook_token = req.user.facebook_token;
			req.session.user = user
			
			}else{
				user.name = namePlay(result,'Anônimo');
				req.session.user = user
			}
			
			res.render('roomPlay',{
			user
		});	
		
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

function namePlay(room,nomeInRoom){

  for (var i = room.length - 1; i >= 0; i--) {

    if(room[i].name == nomeInRoom){  
    numero = '('+numeroPlay+')'
    nomeInRoom = "Anônimo"+numero;
    numeroPlay +=1 
    return namePlay(room,nomeInRoom);

	}
  }
 numeroPlay = 0 
 return nomeInRoom 
}


