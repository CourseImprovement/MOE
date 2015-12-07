$(document).ready(function(){
	var name = getName();
	$('#project').html(name);
	$.get('../moe/index/' + name.toLowerCase() + '.json', function(proj){
		proj = JSON.parse(proj);

		for (var i = 0; i < proj.length; i++){
			if (proj[i].group.children.length > 0){
				$('#display').append('<h4>' + proj[i].path + '</h4>');
				for (var j = 0; j < proj[i].group.children.length; j++){
					var g = proj[i].group.children[j];
					header(g.comment.name);
					printTasks(g);
				}
			}
			else if (proj[i].group.comments.length > 0){
				$('#display').append('<h4>' + proj[i].path + '</h4>');
				for (var j = 0; j < proj[i].group.comments.length; j++){
					var g = proj[i].group.comments[j];
					if (!g) continue;
					printTasks({
						comments: [g]
					}, g.name);
				}
			}
		}

	});
})

function printTasks(group, name){
	for (var i = 0; i < group.comments.length; i++){
		if (group.comments[i]){
			var result = '';			
			if (group.comments[i].todos && group.comments[i].todos.children && group.comments[i].todos.children.length > 0){	
				if (name) header(name);
				result += '<table class="ui celled table"><thead><tr><th width="200px">Name</th><th>Tasks</th></tr></thead>';
				result += '<tr><td>' + group.comments[i].name + '</td><td><table class="ui celled table"><thead><tr><th>Task</th><th width="140px">Assigned To</th><th width="100px;" style="text-align: center;">Complete</th></tr></thead>';
				for (var j = 0; j < group.comments[i].todos.children.length; j++){
					result += '<tr>';
					result += '<td>' + group.comments[i].todos.children[j].value + '</td>';
					result += '<td>' + group.comments[i].todos.children[j].assign + '</td>';
					console.log(group.comments[i].todos.children[j]);
					result += '<td style="text-align: center;">' + (group.comments[i].todos.children[j].complete ? '<i class="icon checkmark"></i>' : '<i class="icon close"></i>') + '</td>';
					result += '</tr>';
				}
				result += '</table></td></tr>';
			}
			result += '</table>';
			$('#display').append(result);
		}
	}	
}

function getName(){
	return window.location.href.split('proj=')[1].toUpperCase();
}

function header(name){
	$('#display').append('<h4 class="ui horizontal divider header"><i class="tag icon"></i> ' + name + '</h4>');
}