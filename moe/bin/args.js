function Args(args){
	this._args = args;
	this.flags = {};
	this.args = [];
}

Args.prototype.parse = function(){
	for (var i = 0; i < this._args.length; i++){
		if (this._args[i][0] == '-'){ // flag
			if (this._args[i].indexOf('=')){

			}
			else{
				var a = this._args[i]
				this.flags[]
			}
		}
	}
}

module.exports = Args;