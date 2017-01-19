var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs'),
    path = require('path');
	
// Chargement de la page telecommande.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/telecommande.html');
})
.get('/score', function (req, res) {
  res.sendfile(__dirname + '/scoreboard.html');
});

app.use("/content", express.static(__dirname + '/content'));

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('connected', function() {
        socket.broadcast.emit('new_connexion');
    });
	
	// Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('majTable', function (data) {
        scRouge = data.scRouge;
		scBlanc = data.scBlanc;
        socket.broadcast.emit('majTable', {scRouge: scRouge, scBlanc: scBlanc});
    }); 
	
	//On doit gérer une mise à jour du score rouge
	socket.on('majScRouge', function(data) {
		console.log(data);
		socket.broadcast.emit('majScRouge', data);
	});
	
	//On doit gérer une misa à jour du score blanc
	socket.on('majScBlanc', function(data) {
		console.log(data);
		socket.broadcast.emit('majScBlanc', data);
	});
	
	//On lance le compte à rebours
	socket.on('start', function() {
		console.log("start");
		socket.broadcast.emit('start');
	});
	
	//On fait un stop
	socket.on('stop', function() {
		console.log("stop");
		socket.broadcast.emit('stop');
	});
	
	//On fait une pause
	socket.on('pause', function() {
		console.log("stop");
		socket.broadcast.emit('pause');
	});
	
	//On fait un reset
	socket.on('reset', function() {
		console.log("reset");
		socket.broadcast.emit('reset');
	});
        
        //On reçoit une première faute de rouge
        socket.on('fGRouge', function(data) {
            console.log(data);
            socket.broadcast.emit('fGRouge', data);
        });
        
        //On reçoit une seconde faute de rouge
        socket.on('fDRouge', function(data) {
            console.log(data);
            socket.broadcast.emit('fDRouge', data);
        });
	
        //On reçoit une première faute de blanc
        socket.on('fGBlanc', function(data) {
            console.log(data);
            socket.broadcast.emit('fGBlanc', data);
        });
        
        //On reçoit une première faute de blanc
        socket.on('fDBlanc', function(data) {
            console.log(data);
            socket.broadcast.emit('fDBlanc', data);
        });
        
        //Mise à jour du temps souhaité
        socket.on('chgTime', function(data) {
            console.log("Nouveau temps souhaité : "+data);
            socket.broadcast.emit('chgTime', data);
        });
});

server.listen(8080);