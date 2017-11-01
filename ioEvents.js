util = require('./utils.js');

module.exports = function(io,sessionStore){

	io.on("connection",function(socket){
		
		var user = socket.handshake.session.user;

		util.updateSocketUser(user,socket.id);
		
		socket.on("joinRoom",function(params){
			console.log("joinn");
			util.joinRoom(user,socket.id);
			for(var i = 1;i<100;i++){
				util.getMovie(i);
			}

			
		});
		
		socket.on("disconnect",function(){
			console.log( socket.id +" desconectado")
			util.removeSocket(socket.id);
			
		})
		
	});

}