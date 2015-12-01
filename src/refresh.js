var js = require('./js.js');

function refresh(){

}

refresh.prototype.run = function(args){
	this.args = args;
	js.refresh();
}

module.exports = new refresh();