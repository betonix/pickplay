var _IO = null;

exports.init = function(io) {
		_IO = io;
};

exports.socket = function(){
	return _IO;
	
}

