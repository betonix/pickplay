var _IO = null;

exports.init = function(io) {
		_IO = io;
};

exports.socket = function(){
	return _IO;
	
}

exports.updateSocketUser = function (req,socket,db){

	if(req.user!undefined){
		var collection = db.get().collection('user');

		socket.on('connection',function(s){

			collection.update({facebook_id:req.user.facebook_id},$set{socket:s.id});

		})
		
	}
}
