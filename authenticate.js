var FacebookStrategy = require('passport-facebook').Strategy;
var db = require('./db.js');
// load up the user model
var User       = require('./user.js');

// load the auth variables
var configAuth = require('./auth.js'); // use this one for testing



module.exports = function(passport) {
	
	passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        
            done(null, user);
       
    });

    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'name', 'displayName', 'picture.type(large)', 'hometown', 'profileUrl', 'friends'] ,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        console.log(profile);
		process.nextTick(function() {
			 var collection = db.get().collection('user');
			 
			 var newUser            = new Object();

                newUser.facebook_id    = profile.id; // set the users facebook id                   
                newUser.facebook_token = token; // we will save the token that facebook provides to the user                    
                newUser.facebook_name  = profile.displayName // look at the passport user profile to see how names are returned	
				newUser.socket  = null // look at the passport user profile to see how names are returned	
				newUser.pontos = 0 ;
				newUser.picture = profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
			 
			 collection.find({facebook_id:profile.id}).toArray(function(err, user){
				
				if(user.length>0){					
					done(null, user[0]);
					
				}else{					
					collection.save(newUser,function(user){
						done(null, newUser);
					});
				}
			 
			 })		 		 
			
		})
   
    }));

};