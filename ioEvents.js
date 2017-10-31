var cookie = require("cookie");

module.exports = function(io,sessionStore){

	io.on("connection",function(socket){
		
		var session = socket.handshake.session;
		console.log(session);
		socket.on("joinRoom",function(){
			
			
		});
	
	
	
	});

}