eventRooms = require('./eventRoom.js');
util = require('./utils.js');
fb = require('./fb.js');
module.exports = function(io){

	io.on("connection",function(socket){
		
		var user = socket.handshake.session.user;
		util.updateSocketUser(user,socket.id);
		
		
		socket.on("joinRoom",function(params){
			util.joinRoom(user,socket.id);		
			util.getOneMovie('acao',function(movie){
				util.sendMovie(socket,movie);
			})				
		});

		fb.getFbData(user.facebook_token,user.facebook_id,function(data){
			console.log(data);		
		})
		
		socket.on("nextMovie",function(answer){
		
		eventRooms.answer(socket.handshake.session.movie.title,socket,function(result){
			
			util.getOneMovie('acao',function(movie){
				util.sendMovie(socket,movie);
				socket.to(socket.id).emit('getmovie',movie);
			})	
			
		})		
			
		});
		
		socket.on("disconnect",function(){
			console.log( socket.id +" desconectado")
			util.removeSocket(socket.id);
			
		})
		
		socket.on("answer",function(opts){
			console.log(socket.handshake.session.movie);
			
		})
		
	});

}