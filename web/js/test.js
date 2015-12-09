var _name = getName().toLowerCase();
var file = ''
if (_name.indexOf('.js') > -1) file = _name.split('.js')[0];
else file = _name;
var url = '../projects/' + _name + '/build/' + file + '.js';
$.get(url, function(javascript){
	eval(javascript);
	$(document).ready(function(){
		var name = getName();
		$('#project').html(name);
		$.get('../moe/index/' + name.toLowerCase() + '.json', function(proj){
			proj = JSON.parse(proj);
			var tests = getAllTests(proj);
			runTests(tests);
		});
	});
})

function getAllTests(ary, path){
	var result = [];
	for (var i = 0; i < ary.length; i++){
		if (ary[i].group && ary[i].group.comments && ary[i].group.comments.length > 0){
			for (var j = 0; j < ary[i].group.comments.length; j++){
				var test = ary[i].group.comments[j].test;
				if (test && test.length > 0){
					result.push({
						path: ary[i].path,
						name: ary[i].group.comments[j].name,
						test: test
					});
				}
			}
		}
		else if (ary[i].comments && ary[i].comments.length > 0){
			for (var j = 0; j < ary[i].comments.length; j++){
				var test = ary[i].comments[j];
				if (!test) continue;
				test = test.test;
				if (test && test.length > 0){
					result.push({
						path: path,
						name: ary[i].comments[j].name,
						test: test
					});
				}
			}
		}
		if (ary[i].group && ary[i].group.children.length > 0){
			var r = getAllTests(ary[i].group.children, ary[i].path);
			result = result.concat(r);
		}
	}
	return result;
}

function header(name){
	$('#display').append('<h4 class="ui horizontal divider header"><i class="tag icon"></i> ' + name + '</h4>');
}

function getName(){
	return window.location.href.split('proj=')[1].toUpperCase();
}

function assert(condition, msg){
	if (!condition){
		errs.push(msg);
	}
}

var errs = [];

function err(msg){
	$(spot).find('tbody').append('<tr><td>' + msg + '</td></tr>');
}

var spot = null;

function runTests(tests){
	for (var i = 0; i < tests.length; i++){
		var test = tests[i];
		var split = test.test.split('\n');
		for (var j = 0; j < split.length; j++){
			eval('var context = (function(){' + split[j] + '})(); context = null;');
		}
		var html = '<table class="ui table ' + (errs.length == 0 ? 'green' : 'red') + '" id="spot"><thead><tr><th>' + test.path + '</th></tr></thead><tbody></tbody></table>';
		header(test.name);
		spot = $('#display').append(html).find('#spot').removeAttr('id');
		for (var j = 0; j < errs.length; j++){
			err(errs[j]);
		}

		errs = [];
	}
}