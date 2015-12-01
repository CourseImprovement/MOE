var fs = require('fs');
var vm = require('vm');

function js(){
	this.args = null;
}

function getConfig(){
	var str = JSON.parse(fs.readFileSync('./config.json'));
	if (!str.js) {
		str.js = {
			include: {},
			extend: {},
			create: {}
		}
	}
	if (!str.js.include) str.js.include = {};
	if (!str.js.extend) str.js.extend = {};
	if (!str.js.create) str.js.create = {};
	return str;
}

function error(msg){
	console.log('\nerror: ' + msg + '\n');
	process.exit();
}

function help(){
	console.log(
		'\nMOE - (maintainable, organized and efficient\n' +
		'moe (C) BYU-Idaho\n' +
		'-----------------------------------------------------------\n' + 
		'Usage\n\n' + 
		'moe js include [path] [variableName | functionName() | *]\n'
	);
}

js.prototype.run = function(args){
	this.args = args;
	if (this.args.length == 0){
		help();
	}
	else{
		var cmd = this.args[0];
		args.splice(0, 1);
		switch (cmd){
			case 'include': this.include(); break;
		}
	}
}

js.prototype.include = function(){
	if (this.args.length < 1) {
		help();
		error('Invalid arguments');
	}
	var path = this.args[0];
	this.args.splice(0, 1);
	// Check if file exists
	try{
		var stat = fs.statSync(path);
	}
	catch (e){
		error('File does not exist');
	}
	this.config = getConfig();
	if (!this.config.js.include[path]) this.config.js.include[path] = [];
	if (this.args.length > 0){
		for (var i = 0; i < this.args.length; i++){
			if (this.config.js.include[path].indexOf(this.args[i]) == -1){
				this.config.js.include[path].push(this.args[i]);
			}
		}
	}
	else{
		this.config.js.include[path].push('*');
	}

	var fileName = path.split('/');
	fileName = fileName[fileName.length - 1];
	var ext = fileName.split('.')[1];
	fileName = fileName.split('.')[0];

	// make the include folder
	try{
		fs.readdirSync('src/' + fileName);
	}
	catch (e){
		fs.mkdirSync('src/' + fileName);
	}

	fs.writeFileSync('src/' + fileName + '/include.js', this.readFileIncludes(path));

	this.saveConfig();
}

js.prototype.readFileIncludes = function(path){
	var includes = this.config.js.include[path];
	var js = '';
	var file = fs.readFileSync(path);

	var sandbox = {};
	var context = new vm.createContext(sandbox);
	var script = new vm.Script(file);

	for (var i = 0; i < 10; ++i) {
	  script.runInContext(context);
	}

	if (includes[0] == '*') return file;
	else{
		for (var i = 0;i < includes.length; i++){
			js += this.stringify(sandbox, includes[i]);
		}
		return js;
	}
}

js.prototype.stringify = function(sandbox, include){
	var path = [];
	if (include.indexOf('.') > -1){
		path = include.split(/\./g);
	}
	else{
		path.push(include);
	}
	var spot = sandbox;
	for (var i = 0; i < path.length; i++){
		spot = spot[path[i]];
	}
	switch (this.type(spot)){
		case 'function': return 'var ' + path[path.length - 1] + ' = ' + spot.toString();
		default: return ('var ' + path[path.length - 1] + ' = ' + JSON.stringify(spot));
	}
}

js.prototype.type = function(obj){
	var t = Object.prototype.toString.call(obj);
	var ty = t.replace('[object ', '').replace(']', '').toLowerCase();
	return ty;
}

js.prototype.saveConfig = function(){
	var str = JSON.stringify(this.config, null, "\t");
	fs.writeFile('config.json', str, function (err) {
	  if (err) throw err;
	});
}

module.exports = new js();