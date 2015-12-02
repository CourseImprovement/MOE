#! /usr/bin/env node

function executeScript(path, args){
	try{
		var init = require(path);
		init.run(args);
	}
	catch (e){
		console.log(e);
		console.log('Invalid command');
	}
}

(function(){
	var args = process.argv.slice(2);

	if (args.length == 0){
		console.log(
			'\nMOE - (maintainable, organized and efficient\n' +
			'moe (C) BYU-Idaho\n' +
			'-----------------------------------------------------------\n' + 
			'Usage\n\n' + 
			'\n'
		);
	}
	/**
	 * Where the program begins
	 */
	else{
		var cmd = args[0];
		args.splice(0, 1);
		executeScript('./moe/' + cmd + '.js', args);
	}

})()