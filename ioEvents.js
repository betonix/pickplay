util = require('./utils.js');

module.exports = function(io,sessionStore){

	io.on("connection",function(socket){
		
		var user = socket.handshake.session.user;

		util.updateSocketUser(user,socket.id);
		
		socket.on("joinRoom",function(params){
			util.joinRoom(user,socket.id);	
			
			util.getMovie(function(movie){
				util.sendMovie(socket,movie);
			});		
			
		});
		
		socket.on("nextMovie",function(){
		
			receive = new Date(socket.handshake.session.movie.timeSend);					
			send =  new Date();
			
			timeAnswer = (send.getTime() - receive.getTime())/1000;
			
			util.getMovie(function(movie){
				util.sendMovie(socket,movie);	
			});		
			
		});
		
		socket.on("disconnect",function(){
			console.log( socket.id +" desconectado")
			util.removeSocket(socket.id);
			
		})
		
	});

}