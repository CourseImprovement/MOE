#! /usr/bin/env node

function executeScript(path, args){
	var init = require(path);
	init.run(args);
}

(function(){
	var args = process.argv.slice(2);

	if (args.length == 0){
		console.log(
			'\nMOE - (maintainable, organized and efficient\n' +
			'moe (C) BYU-Idaho\n' +
			'-----------------------------------------------------------\n' + 
			'Usage\n\n' + 
			'moe init\tCreates the new JSON (config) file\n' + 
			'moe refresh\tReloads all the included and extended files\n' + 
			'moe js\t\tRun the JavaScript segment based on the config\n' +
			'\n\nInstructions\n' + 
			'-----------------------------------------------------------\n' + 
			'Before running any moe command, make sure you\'re in the\n' + 
			'directory where the project will reside. When running any\n' + 
			'moe command, be in the same directory where the config.json\n' +
			'resides.' +
			'\n'
		);
	}
	/**
	 * Where the program begins
	 */
	else{
		var cmd = args[0];
		args.splice(0, 1);
		switch (cmd){
			case 'init': executeScript('./src/init.js', args); break;
			case 'js': executeScript('./src/js.js', args); break;
			case 'refresh': executeScript('./src/refresh.js', args); break;
		}
	}

})()