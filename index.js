const KEY = 'name-cookie';
const SECRET = 'chace-secreta';
const dbMovieApi = '1867f61baa228323cefe3f8697601a0f'

var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var app = express();
var server = require('http').createServer(app);
var socketIO = require('socket.io');
var cookie = cookieParser(SECRET);
var store = new expressSession.MemoryStore();
var db = require('./db.js');
var passport = require('passport');

var io = socketIO.listen(server);


var sessao = expressSession({
   secret: SECRET,
   name: KEY,
   resave: true,
   saveUninitialized: true,
   store: store
 })

app.set('views',__dirname);
app.set('view engine','ejs');
app.use(cookie);
app.use(sessao);
app.use(passport.initialize());
app.use(passport.session());

io.use(function(socket, next) {
   var data = socket.request;
   cookie(data, {}, function(err) {
     var sessionID = data.signedCookies[KEY];
     store.get(sessionID, function(err, session) {
       if (err || !session) {
         return next(new Error('Acesso negado!'));
       } else {
         socket.handshake.session = session;
         return next();
       }
     });
   });
 });
 
 
db.connect(function(err){
	
	if (err){
		console.log('db is not connected!')
		process.exit(1);
	}else{
		server.listen(3000);
		console.log('listen on port 3000!')
	}
	
});
require('./socketEvents.js').init(io);
require('./authenticate.js')(passport);
require('./routes.js')(app,passport);


 

 
 