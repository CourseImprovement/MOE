var colors = require('colors');

function help(){
	console.log(
		'\nMOE - (maintainable, organized and efficient\n' +
		'moe (C) BYU-Idaho\n' +
		'-----------------------------------------------------------\n' + 
		'Usage\n\n' + 
		'moe project pull\t\tDisplay all the Project items\n' +
		'\n'
	);
	process.exit();
}

function Project(){
	this.name = '';
}

Project.prototype.run = function(args){
	this.args = args;
	this.cmd();
}

Project.prototype.setFlags = function(){
	for (var i = this.args.length - 1; i > -1; i--){
		if (this.args[i][0] == '-' && this.args[i][1] == '-'){
			var arg = this.args[i].split('--')[1];
			switch (arg){
				case 'help': {
					help();
				}
				default: {
					console.log('Invalid arg');
				}
			}
			this.args.splice(i, 1);
		}
	}
}

Project.prototype.pull = function(){
	// or more concisely
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { console.log('Done.') }
	exec("git submodule foreach git pull origin master", puts);
}

Project.prototype.cmd = function(){
	this.setFlags();
	if (this.args.length > 0){ // moe Project
		var arg = this.args[0];
		if (arg == 'pull'){
			this.pull();
		}
	}
	else{
		help();
	}
}

module.exports = new Project();