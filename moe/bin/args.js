function Args(args){
	this._args = args;
	this.flags = {};
	this.args = [];
	this.parse();
}

Args.prototype.parse = function(){
	for (var i = 0; i < this._args.length; i++){
		if (this._args[i][0] == '-'){ // flag
			if (this._args[i].indexOf('=')){
				var a = this._args[i].slice(1, this._args[i].length);
				var split = a.split('=');
				this.flags[split[0]] = split[1];
			}
			else{
				var a = this._args[i].slice(1, this._args[i].length);
				this.flags[a] = true;
			}
		}
		else{
			this.flags.push(this._args[i]);
		}
	}
}

module.exports = Args;