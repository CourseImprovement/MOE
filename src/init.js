var prompt = require('prompt');
var fs = require('fs');

function error(msg){
	console.log(msg);
	process.exit();
}

function Init(){
	this.args = null;
	this.json = {
		config: {}
	};
};

Init.prototype.run = function(args){
	this.args = args;
	var _this = this;
	prompt.message = '(moe)';
	prompt.start();
	prompt.get(['name', 'author'], function (err, result) {
		if (err){
				error(err);
			}
		_this.json.name = result.name;
		_this.json.author = result.author;
    _this.config();
  });
};

Init.prototype.config = function(){
	var _this = this;
	prompt.get({
		properties: {
			config: {
				description: 'Do you want additional config settings? [Yn]',
				default: 'Y',
				type: 'string'
			}
		}
	}, function(err, result){
		if (err){
			error(err);
		}
		if (result.config.toLowerCase() == 'y'){
			prompt.get({
				properties: {
					makeDocs: {
						description: 'Make Documentation? [yN]',
						type: 'string',
						default: 'Y'
					},
					forceReview: {
						description: 'Force peer review? [yN]',
						default: 'Y',
						type: 'string'
					}
				}
			}, function(err, result){
				if (err){
					error(err);
				}
				_this.json.config.makeDocs = result.makeDocs.toLowerCase() == 'y' ? true : false;
				_this.json.config.forceReview = result.forceReview.toLowerCase() == 'y' ? true : false;
				_this.save();
			});
		}
		else{
			_this.json.config = {};
			_this.save();
		}
	});
};

Init.prototype.save = function(){
	var str = JSON.stringify(this.json, null, "\t");
	console.log(str);
	fs.writeFile('config.json', str, function (err) {
	  if (err) throw err;
	  console.log('Saved, see config.json');
	});
	try {
		var dir = fs.readdirSync('src');
	}
	catch (e){
		fs.mkdirSync('src');
	}
};

module.exports = new Init();