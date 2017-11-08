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
		user.pontos = 0 ;
		collection.insert(user,function(err,result){
			
		});
		
	},
	
	removeSocket : function (socketId){
		var collection = db.get().collection('rooms');
		
		collection.remove({socket:socketId});
		
	},
	
	getOneMovie : function (type,done){
		idGenre  = null;
		
		if(type == 'terror'){
			idGenre = 27;		
		}else if(type == 'acao'){			
			idGenre = 28;	
		}else if(type == 'aventura'){
			idGenre = 12;	
		}else if(type == 'ficcao'){
			idGenre = 878;
		}else if(type == 'romance'){
			idGenre = 10749;
		}
		
		var movies = db.get().collection('movies');
		
		var collection = db.get().collection('moviesSend');
		
		/*movies.find({genre_ids : { $in : [idGenre]}}).toArray(function(err,result){
			random = randomMovie(result.length)				
			collection.insert({room:idGenre,number:random});
			movie = result[random];
			
			mov = {}
			mov.title = movie.title
			mov.release = movie.release_date
			mov.image = movie.backdrop_path
			mov.alternativas = options(movie.similares,movie.title)
			
			done(mov);
			
		});*/
		
		movies.aggregate({$match: {genre_ids: {$in : [idGenre]} }},{$sample:{size:1}},(function(err,result){
			console.log("resultado : "+result)
			movie = result[0];
			mov = {}
			mov.title = movie.title
			mov.release = movie.release_date
			mov.image = movie.backdrop_path
		  //mov.alternativas = options(movie.similares,movie.title)
			
			done(mov);			
		}));
	},
	
	sendMovie : function(socket,movie){	
		
		m = {}
	    m.title = movie.title;
		m.timeSend = new Date();
		socket.handshake.session.movie = m;	
		movie.title = null;
		socket.emit("joinRoom",movie);		
	},
	
	putSimilares : function(){
		var collection = db.get().collection('movies');
		
		collection.find({}).toArray(function(err,result){
			var oks = 0;
			similarMovie(result,0,function(movie,similares){
				collection.update({_id : movie._id},{$set:{similares : similares}});				
			});
			
			
		})
		
	},
	
	saveMovies : function(){
		getAllMovies (1);
	},
	
	sendToRoom : function(room,socket){
		
		var collection = db.get().collection('rooms');
		
		collection.find({room:room}).toArray(function(){			
		
		});
	}
	

}

function similarMovie(result,n,done){
if(result.length==n){
	return""
}	
movie_id = result[n].id;

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
	done(result[n],data.results);
	similarMovie(result,n+1,done);

  });
});

req.write("{}");
req.end();
}


function getAllMovies (pag) {
	console.log("pagina: "+pag);
	if (pag==982){
		return "fim";
	}
	var http = require("https");

	var options = {
	  "method": "GET",
	  "hostname": "api.themoviedb.org",
	  "port": null,
  //  "path": "/3/movie/popular?language=pt-BR&page=1&api_key="+API,
	  "path": "/3/movie/popular?page="+pag+"&language=en-US&api_key="+API,
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
		if(data.results!=undefined){
			var collection = db.get().collection('movies');

			collection.insert(data.results,function(){
				console.log("pagina " +pag+" gravada");
				getAllMovies (pag+1);
			})				
			
		}else{
			getAllMovies (pag+1)
		}
			
	  });
	});

	req.write("{}");
	req.end();
	
}

function randomMovie(length){
  return Math.floor((Math.random()*length)+0);

}


function options (movies,title){
	similires = []
	similires.push(title);
	for (var i = 0; i < 6; i++) {
	   if(movies[i]!=undefined){
		   similires.push(movies[i].title);
	   }
   }
	return shuffle(similires);
}

var shuffle = function( el ) {
 var i = el.length, j, tempi, tempj;
 if ( i == 0 ) return el;
 while ( --i ) {
    j       = Math.floor( Math.random() * ( i + 1 ) );
    tempi   = el[i];
    tempj   = el[j];
    el[i] = tempj;
    el[j] = tempi;
 }
 return el;
}














