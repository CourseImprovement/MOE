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

function Watch(){

}

function puts(error, stdout, stderr) { if (stderr) console.log(stderr); }

Watch.prototype.run = function(args){
	var fs = require('fs');
	console.log('Watching all projects...');
	fs.watch('./projects', {recursive: true}, function(e, name){
		if (name.indexOf('build/') > -1) return;
		var proj = name.split('/')[0];
		exec("moe index", puts);
		exec("grunt --base ./projects/" + proj + " --gruntfile ./projects/" + proj + "/GruntFile.js", puts);
		console.log('Building....');
	});
}

module.exports = new Watch();