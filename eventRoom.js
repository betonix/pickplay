db = require('./db.js');


module.exports = {
	
	answer : function(answer,socket,done){
		var title = socket.handshake.session.movie.title;
		var receive = new Date(socket.handshake.session.movie.timeSend);					
		var send =  new Date();		
		var timeAnswer = (send.getTime() - receive.getTime())/1000;	
		
		if (timeAnswer <= 7){
			 acerto = 12;
			
		}else if (timeAnswer > 7 && timeAnswer < 13){
			
			 acerto = 6;
			
		}else{
			 acerto = 2;
		}
		
		var collection = db.get().collection('rooms');
		var users = db.get().collection('user');
		
		collection.find({socket:socket.id}).toArray(function(err,result){
			var pontos = result[0].pontos;
			if(title==answer){
				
				collection.update({socket:socket.id},{$set:{pontos:pontos+acerto}},function(){
					users.update({socket:socket.id},{$inc:{['pontos_'+result[0].room] : acerto}},function(err,result){
						done(result[0],acerto);
					})
				})
			
			}else{
				
				done(null,null);
				
			}
						
		})
				
	}

}