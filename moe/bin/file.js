var fs = require('fs');

function Group(parent){
	this.children = [];
	this.parent = parent;
	this.type = null;
	this.comment = null;
	this.comments = [];
}

function Comment(){
	this.name = null;
	this.description = null;
	this.require = [];
	this.test = '';
	this.todos = [];
	this.isGroup = false;
	this.hasAnnotation = false;
	this.reviewedBy = null;
}

function Todo(){
	this.complete = false;
	this.value = null;
	this.assign = null;
	this.depth = -1;
	this.parent = null;
	this.children = [];
}

Todo.parse = function(line){
	var todo = new Todo();
	todo.complete = line.match(/[ ]+([+|-])(?=( [a-zA-Z ]+)([^;]))/)[0].indexOf('+') > -1;
	todo.value = line.replace(/.\*[ ]+([+|-])(?=( [a-zA-Z ]+)([^;])) /, '');
	todo.value = todo.value.split('(')[0];
	if (line.indexOf('(') > -1){
		todo.assign = line.match(/[a-zA-Z]+(?=\))/)[0];
	}
	todo.depth = Todo.getDepth(line);
	return todo;
}

Todo.isTodo = function(line){
	return line.match(/\*[ ]+([+|-])/g) != null || line.match(/\*[ ]+([+|-])/g) != undefined;
}

Todo.getDepth = function(line){
	return line.match(/[ ]+([+|-])(?=( [a-zA-Z ]+)([^;]))/)[0].split(' ').length - 2;
}

function File(path){
	try{
		this.txt = fs.readFileSync(path, 'utf8');
		this.path = path;
		this.cl = '';
		this.currentGroup = new Group(null); // global group
		var top = this.currentGroup;
		this.currentComment = null;
		this.parse();
		this.currentGroup = top;
	}
	catch (e){
		console.log(e);
		console.log(path);
	}
	this.group = this.currentGroup;
	this.currentGroup = null;
	this.currentComment = null;
	delete this.currentGroup;
	delete this.txt;
	delete this.cl;
	delete this.currentComment;
}

File.prototype.parse = function(){
	var lines = this.txt.split(/\n/g);
	
	var comment = false;
	for (var i = 0; i < lines.length; i++){
		this.cl = lines[i];
		if (lines[i].indexOf('/**') > -1) {
			comment = true;
			this.currentComment = new Comment();
		}
		if (lines[i].indexOf('*/') > -1) {
			//if (this.path.indexOf('src/survey.js') > -1) console.log(this.currentComment);
			if (this.currentComment && this.currentComment.hasAnnotation){
				this.currentGroup.comments.push(this.currentComment);
			}
			comment = false;
			this.currentComment = null;
		}

		if (comment){
			var ann = this.getAnnotation();
			switch (ann){
				case 'start': {
					var val = this.getValue();
					var words = val.trim().split(' ');
					var name = words[0];
					if (name != 'test'){
						this.openGroup();
						this.currentGroup.name = name;
						this.currentComment.isGroup = true;
					}
					else{
						this.cl = lines[++i]; // eat the annotation
						while (this.cl.indexOf('@end') == -1){
							var txt = this.cl.replace(/.\*[ ]+/g, '');
							this.currentComment.test += txt;
							this.cl = lines[++i];
						}
					}
					this.currentComment.hasAnnotation = true;
					break;
				}
				case 'end': {
					this.closeGroup();
					this.currentComment.hasAnnotation = true;
					break;
				}
				case 'name': {
					this.currentComment.name = this.getValue();
					this.currentComment.hasAnnotation = true;
					break;
				}
				case 'require': {
					this.currentComment.require.push(this.getValue());
					this.currentComment.hasAnnotation = true;
					break;
				}
				case 'description': {
					this.currentComment.description = this.getValue();
					this.currentComment.hasAnnotation = true;
					break;
				}
				case 'assign': {
					this.currentComment.assign = this.getValue();
					this.currentComment.hasAnnotation = true;
					break;
				}
				case 'reviewedBy': {
					this.currentComment.reviewedBy = this.getValue();
					this.currentComment.hasAnnotation = true;
					break;
				}
				case 'todo': {
					this.cl = lines[++i];
					while (Todo.isTodo(this.cl)){
						this.currentComment.todos.push(Todo.parse(this.cl));
						this.cl = lines[++i];
					}
					this.sortTodos();
					this.currentComment.hasAnnotation = true;
					i--;
					break;
				}
			}
		}
	}
}

File.prototype.sortTodos = function(){
	var top = new Todo();
	top.name = 'global';
	var currentLevel = top;
	currentLevel.depth = 0;
	for (var i = 0; i < this.currentComment.todos.length; i++){
		if (currentLevel.depth == this.currentComment.todos[i].depth) {
			currentLevel.parent.children.push(this.currentComment.todos[i]);
			this.currentComment.todos[i].parent = currentLevel.parent;
			currentLevel = this.currentComment.todos[i];
		}
		else if (currentLevel.depth < this.currentComment.todos[i].depth) {
			currentLevel.children.push(this.currentComment.todos[i]);
			this.currentComment.todos[i].parent = currentLevel;
			currentLevel = this.currentComment.todos[i];
		}
		else{
			var numOfParents = currentLevel.depth - this.currentComment.todos[i].depth;
			for (var j = 0; j < numOfParents; j++){
				currentLevel = currentLevel.parent;
			}
			currentLevel.parent.children.push(this.currentComment.todos[i]);
			this.currentComment.todos[i].parent = currentLevel.parent;
			currentLevel = this.currentComment.todos[i];
		}
	}
	this.currentComment.todos = top;
}

File.prototype.openGroup = function(){
	var group = new Group(this.currentGroup);
	this.currentGroup.children.push(group);
	this.currentGroup = group;
	group.comment = this.currentComment;
}

File.prototype.closeGroup = function(){
	this.currentGroup = this.currentGroup.parent;
}

File.prototype.getAnnotation = function(){
	if (this.cl.match(/.+(\*)([ ]+)@/)){
		var txt = this.cl.match(/@[a-zA-Z]+/);
		return txt[0].replace('@', '');
	}
	return '';
}

File.prototype.getValue = function(){
	return this.cl.split(/@[a-zA-Z]+/)[1].trim();
}

module.exports = File;