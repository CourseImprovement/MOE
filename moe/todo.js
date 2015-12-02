var fs = require('fs');
var path = require('path');
var colors = require('colors');

function help(){
	console.log(
		'\nMOE - (maintainable, organized and efficient\n' +
		'moe (C) BYU-Idaho\n' +
		'-----------------------------------------------------------\n' + 
		'Usage\n\n' + 
		'moe todo\t\tDisplay all the todo items\n' + 
		'moe todo [name]\t\tShow only tasks assigned to the name\n' +
		'moe todo status\t\tShow the overall and user progress\n' + 
		'moe todo --mute\t\tMute the uncommented functions\n' + 
		'moe todo --names\tDisplay the names assigned to the task\n' +
		'moe todo --show\t\tShow the different tasks for the files\n' + 
		'\n'
	);
	process.exit();
}

function Todo(){
	this.todos = [];
	this.mute = false;
	this.names = false;
	this.show = false;
	this.filter = false;
	this.name = '';
	this.status = false;
}

Todo.prototype.run = function(args){
	this.args = args;
	this.cmd();
}

Todo.prototype.filterName = function(){
	if (this.filter){
		for (var i = this.todos.length - 1; i > -1; i--){
			if (this.todos[i].assigned.toLowerCase() != this.name.toLowerCase()){
				this.todos.splice(i, 1);
			}
		}
		this.names = false;
	}
}

Todo.prototype.showStatus = function(){
	var result = {
		names: {},
		complete: 0,
		notComplete: 0
	};
	for (var i = 0; i < this.todos.length; i++){
		result.complete += this.todos[i].complete.length;
		result.notComplete += this.todos[i].notComplete.length;
		if (this.todos[i].assigned != ''){
			if (!result.names[this.todos[i].assigned]) result.names[this.todos[i].assigned] = {complete: 0, notComplete: 0};
			result.names[this.todos[i].assigned].complete += this.todos[i].complete.length;
			result.names[this.todos[i].assigned].notComplete += this.todos[i].notComplete.length;
		}
	}

	var users = '\nUsers\n---------------';
	for (var user in result.names){
		users += '\n' + user.blue + '\n';
		users += '   Complete: ' + result.names[user].complete + ' (' + ((this.percent(result.names[user].complete, (result.names[user].complete + result.names[user].notComplete)) + '%').green) + ')\n'
		users += '   Not Completed: ' + result.names[user].notComplete + ' (' + ((this.percent(result.names[user].notComplete, (result.names[user].complete + result.names[user].notComplete)) + '%').red) + ')\n'
	}

	console.log(
		'\nOverall\n' + 
		'---------------\n\n' +
		'Completed: ' + result.complete + ' (' + ((this.percent(result.complete, (result.complete + result.notComplete)) + '%').green) + ')\n' +
		'Not Completed: ' + result.notComplete + ' (' + ((this.percent(result.notComplete, (result.complete + result.notComplete)) + '%').red) + ')\n' + 
		users
	);
}

Todo.prototype.percent = function(num, sum){
	return Math.floor((num / sum) * 1000) / 10;
}

Todo.prototype.getAllTodos = function(){
	var filesAry = this.getAllFiles('./projects');
	for (var i = 0; i < filesAry.length; i++){
		this.checkTodos(filesAry[i]);
	}
	this.filterName();
	if (this.status){
		return this.showStatus();
	}
	for (var i = 0; i < this.todos.length; i++){
		if (this.todos[i].notComplete.length > 0){
			var log = '';
			if (this.todos[i].foundNoComment && !this.mute){
				log += '!'.red + ' ';
			}
			else{
				log += '  ';
			}

			log += this.todos[i].path + ' ';
			if (this.show && this.names){
				log += ' (' + this.todos[i].assigned + ')';
			}
			for (var j = 0; j < this.todos[i].complete.length; j++){
				if (this.show){
					log += '\n\t+'.green + ' ' + this.todos[i].complete[j];
				}
				else{
					log += '+'.green;
				}
			}
			for (var j = 0; j < this.todos[i].notComplete.length; j++){
				if (this.show){
					log += '\n\t-'.red + ' ' + this.todos[i].notComplete[j];
				}
				else{
					log += '-'.red;
				}
			}

			if (this.names && !this.show){
				log += ' \t\t(' + this.todos[i].assigned + ')';
			}

			console.log(log);
		}
		else if (this.todos[i].foundNoComment && !this.mute){
			var log = '';
			
			if (this.todos[i].foundNoComment){
				log += '!'.red + ' ';
			}
			else{
				log += '  ';
			}
			if (this.names){
				log += ' (' + this.todos[i].assigned + ')';
			}

			log += this.todos[i].path;
			console.log(log);
		}
	}
}

Todo.prototype.checkTodos = function(pth){
	var file = fs.readFileSync(pth, 'utf8');
	var lines = file.split(/\n/g);
	if (lines.length == 1) return;
	var comment = false;
	var todo = false;
	var components = {
		complete: [],
		notComplete: [],
		path: pth.split('projects')[1],
		foundNoComment: false,
		assigned: ''
	};
	for (var i = 0; i < lines.length; i++){
		if (comment){
			if (lines[i].indexOf('@todo') > -1){
				todo = true;
				continue;
			}
			else if (lines[i].indexOf('@assign') > -1){
				var name = lines[i].split('@assign')[1].trim();
				components.assigned = name;
			}
			if (todo){
				var first = lines[i].replace(/\*/g, '').trim()[0];
				if (first != '-' && first != '+') todo = false;
				else{
					if (first == '-'){
						if (this.show){
							var txt = lines[i].replace(/\*/g, '').replace(/\-/g, '').trim();
							components.notComplete.push(txt);
						}
						else{
							var txt = lines[i].split('- ')[1];
							components.notComplete.push(txt);
						}
					}
					else if (first == '+'){
						if (this.show){
							var txt = lines[i].replace(/\*/g, '').replace(/\+/g, '').trim();
							components.complete.push(txt);
						}
						else{
							var txt = lines[i].split('+ ')[1];
							components.complete.push(txt);
						}
					}
				}
			}
		}
		if (lines[i].indexOf('*/') > -1) comment = false;
		if (lines[i].indexOf('/**') > -1) comment = true;
	}
	var noCommentFound = false;
	for (var i = 0; i < lines.length; i++){
		if (lines[i].indexOf('function') > -1){	
			if ((i - 1 > -1) && lines[i - 1].indexOf('*/') == -1){
				noCommentFound = true;
				break;
			}
		}
	}
	components.foundNoComment = noCommentFound;
	this.todos.push(components);
}

Todo.prototype.getAllFiles = function(dir){
	var result = [];
	var list = fs.readdirSync(dir);
	for (var i = 0; i < list.length; i++){
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);

		if (filename == '.' || filename == '..') {}
		else if (stat.isDirectory() && filename.indexOf('node_modules') == -1){
			var ary = this.getAllFiles(filename);
			result = result.concat(ary);
		}
		else if (filename.indexOf('.js') == -1) {}
		else{
			result.push(filename);
		}
	}
	return result;
}

Todo.prototype.setFlags = function(){
	for (var i = this.args.length - 1; i > -1; i--){
		if (this.args[i][0] == '-' && this.args[i][1] == '-'){
			var arg = this.args[i].split('--')[1];
			switch (arg){
				case 'mute': {
					this.mute = true;
					break;
				}
				case 'names': {
					this.names = true;
					break;
				}
				case 'help': {
					help();
				}
				case 'show': {
					this.show = true;
					break;
				}
				default: {
					console.log('Invalid arg');
				}
			}
			this.args.splice(i, 1);
		}
	}
}

Todo.prototype.cmd = function(){
	this.setFlags();
	if (this.args.length > 0){ // moe todo
		var arg = this.args[0];
		if (arg == 'status'){
			this.status = true;
		}
		else{
			this.filter = true;
			this.name = arg;
			this.names = true;
		}
	}
	this.getAllTodos();
}

module.exports = new Todo();