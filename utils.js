var db = require('./db.js')
const API = '1867f61baa228323cefe3f8697601a0f';
module.exports = {

	updateSocketUser : function (user,socketId,done){
		console.log("entrou pra atualizar")
		if(user.facebook_id!=undefined){
			var collection = db.get().collection('user');
			
			collection.update({facebook_id:user.facebook_id},{$set : {socket:socketId}},function(err,result){
				console.log("atualizou para : " + socketId);
				if(typeof done === "function"){
					done();
				}
			});	
			
		}else{
			
			var collection = db.get().collection('user');
			collection.update({name:user.name},{$set : {socket:socketId}},function(err,result){
				if(typeof done === "function"){
					done();
				}
			});	
			
		}
		
	},
	
	joinRoom : function (user,socketId,done){
		var collection = db.get().collection('rooms');
		user.socket = socketId;
		collection.insert(user,function(err,result){
			
		});
		
	},
	
	removeSocket : function (socketId){
		var collection = db.get().collection('rooms');
		
		collection.remove({socket:socketId});
		
	},
	
	getMovie : function (pag){
		getAllMovies (pag);
	}
}
function similarMovie(movie_id,url){
    
var http = require("https");
  var options = {
  "method": "GET",
  "hostname": "api.themoviedb.org",
  "port": null,
  "path": "/3/movie/"+movie_id+"/similar?language=pt-BR&api_key="+API,
  "headers": {}
  };

var req = http.request(options, function (res) {
  var chunks = [];
  
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    var data = JSON.parse(body.toString());
   for (var i = 0; i < 7; i++) {
	   if(data.results=!undefined){
       similires.push(data.results[i]);
	   }
   }
    
	var collection = db.get().collection('movies');
	filme = {}
	
	filme.similares = similires;
	filme.movie_id = movie_id;
	filme.foto = url;
	
	collection.insert(filme);

  });
});

req.write("{}");
req.end();
}

function randomPage(){
  return Math.floor((Math.random()*100)+0);

}

function randomMovie(){
  return Math.floor((Math.random()*19)+0);

}






function getAllMovies (pag) {
	
	var http = require("https");

	var options = {
	  "method": "GET",
	  "hostname": "api.themoviedb.org",
	  "port": null,
  //  "path": "/3/movie/popular?language=pt-BR&page=1&api_key="+API,
	  "path": "/3/movie/popular?page=1&language=en-US&api_key="+API,
	  "headers": {}
	};

	var req = http.request(options, function (res) {
	  var chunks = [];

	  res.on("data", function (chunk) {
		chunks.push(chunk);
	  });

	  res.on("end", function () {
		var body = Buffer.concat(chunks);
		data = JSON.parse(body.toString());
		
		var collection = db.get().collection('movies');
		for(var i = 0;i<data.results.length;i++){
			collection.insert(data.results[i],function(){
				console.log("gravou: "+ i)
			});
		}
			
	  });
	});

	req.write("{}");
	req.end();
	
}



















