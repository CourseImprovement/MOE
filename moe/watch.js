var colors = require('colors');
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

function isValidTime(first, second){
	return (second - first) > .5;
}

Watch.prototype.run = function(args){
	var isWin = /^win/.test(process.platform);
	var fs = require('fs');
	console.log('Watching all projects...');
	var lastBuiltPath = '';
	var lastBuildTime = null;

	if (isWin){
		fs.watch('.\\projects', {recursive: true}, function(e, name){
			if (name.indexOf('build\\') > -1) return;
			/*if (lastBuiltPath.length == 0) {
				lastBuiltPath = name;
				lastBuildTime = new Date();
			}
			else{
				if (lastBuiltPath == name && !isValidTime(lastBuildTime, new Date())){
					return;
				}
			}

			lastBuildTime = new Date();*/

			var proj = name.split('\\')[0];
			exec("moe index", puts);
			exec("grunt --base .\\projects\\" + proj + " --gruntfile .\\projects\\" + proj + "\\GruntFile.js", puts);

			console.log('Building....');
		});
	}
	else{
		fs.watch('./projects', {recursive: true}, function(e, name){
			if (name.indexOf('build/') > -1) return;
			var proj = name.split('/')[0];
			exec("moe index", puts);
			exec("grunt --base ./projects/" + proj + " --gruntfile ./projects/" + proj + "/GruntFile.js", puts);
			console.log('Building....');
		});
	}

}

module.exports = new Watch();