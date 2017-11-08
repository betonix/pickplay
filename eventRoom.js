db = require('./db.js');
const acerto = 12;
module.exports = {
	
	answer : function(answer,socket,done){
		var title = socket.handshake.session.movie.title;
		var receive = new Date(socket.handshake.session.movie.timeSend);					
		var send =  new Date();		
		var timeAnswer = (send.getTime() - receive.getTime())/1000;	
		
		var collection = db.get().collection('rooms');
		var users = db.get().collection('user');
		
		collection.find({socket:socket.id}).toArray(function(err,result){
			var pontos = result[0].pontos;
			if(title==answer){
				
				collection.update({socket:socket.id},{$set:{pontos:pontos+acerto}},function(){
				
					if (result[0]['pontos_'+result[0].room] == undefined){					
						var pontos = 0;	
						
					}else{					
						var pontos = result[0]['pontos_'+result[0].room]
						
					}
					users.update({socket:socket.id},{$set:{['pontos_'+result[0].room] : pontos + acerto}},function(err,result){
						done(result[0]);
					})
				})
			
			}else{
				
				done(null);
				
			}
						
		})
				
	}

}