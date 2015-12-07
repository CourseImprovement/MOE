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

function Index(){

}

Index.prototype.run = function(args){
	this.args = new Args(args);
	var fs = require('fs');
	var path = require('path');

	var list = fs.readdirSync('./projects');
	var projects = [];
	for (var i = 0; i < list.length; i++){
		var filename = path.join('./projects', list[i]);
		var stat = fs.statSync(filename);
		if (stat.isDirectory()){
			projects.push(filename);
		}
	}

	this.parsed = projects;
	this.createIndex('index');

	for (var j = 0; j < projects.length; j++){
		var name = projects[j] + '';
		var files = dir(name); // fix with path
		var parsed = [];
		for (var i = 0; i < files.length; i++){
			if (files[i].indexOf('/build') > -1 || files[i].indexOf('.git') > -1 || files[i].indexOf('node_modules') > -1 || files[i].indexOf('_hidden') > -1) continue;
			var file = new File(files[i])
			parsed.push(file);
		}
		this.parsed = parsed;
		this.createIndex(name.replace('projects/', ''));
	}
}

Index.prototype.createIndex = function(name){
	var fs = require('fs');
	var cache = [];
	fs.writeFileSync('moe/index/' + name + '.json', JSON.stringify(this.parsed, function(key, value){
		if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
        }
        // Store value in our collection
        cache.push(value);
    }
    return value;
	}, '\t'));
	cache = null;
}

module.exports = new Index();