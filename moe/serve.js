var colors = require('colors');
var sys = require('sys')
var exec = require('child_process').exec;

function help(){
	console.log(
		'\nMOE - (maintainable, organized and efficient\n' +
		'moe (C) BYU-Idaho\n' +
		'-----------------------------------------------------------\n' + 
		'Usage\n\n' + 
		'\n'
	);
	process.exit();
}

function Serve(){

}

function puts(error, stdout, stderr) { if (stderr) console.log(stderr); }

Serve.prototype.run = function(args){
	exec('open http://localhost:8000/web/dashboard.html', puts);
	exec('php -S localhost:8000', puts);
}

module.exports = new Serve();