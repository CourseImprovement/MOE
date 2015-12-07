var colors = require('colors');
var dir = require('./bin/dir.js');
var Args = require('./bin/args.js');
var File = require('./bin/file.js');

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

function Todo(){

}

Todo.prototype.run = function(args){
	this.args = new Args(args);
	var files = dir('./projects'); // fix with path
	var parsed = [];
	for (var i = 0; i < files.length; i++){
		if (files[i].indexOf('/build') > -1 || files[i].indexOf('.git') > -1) continue;
		var file = new File(files[i])
		parsed.push(file);
	}
	this.parsed = parsed;
}

module.exports = new Todo();