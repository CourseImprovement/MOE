var fs = require('fs');
var path = require('path');

function dir(pth){
	var result = [];
	var list = fs.readdirSync(pth);
	for (var i = 0; i < list.length; i++){
		var filename = path.join(pth, list[i]);
		//filename = path.resolve(filename);
		var stat = fs.statSync(filename);

		if (filename == '.' || filename == '..') {}
		else if (stat.isDirectory()){
			if (filename.indexOf('node_modules') > -1 && filename.indexOf('build') > -1) continue;
			var ary = dir(filename);
			result = result.concat(ary);
		}
		else if (filename.indexOf('.js') == -1) {}
		else{
			result.push(filename);
		}
	}
	return result;
}

module.exports = dir;