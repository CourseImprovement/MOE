$.get('../moe/index/index.json', function(projects){
	//projects = JSON.parse(projects);
	for (var i = 0; i < projects.length; i++){
		var p = '';
		if (projects[i].indexOf('projects/') > -1) p = projects[i].replace('projects/', '');
		else p = projects[i].replace('projects\\', '');
		console.log(p);
		$.get('../moe/index/' + p + '.json', function(result, a, b){
			process(result);
		});
	}
})

function process(result){
	var name = result[0].path.replace('projects/', '').split('/')[0];
	var tds = todoStats(result);

	var complete = Math.floor((tds.complete / tds.total) * 1000) / 10;
	if (isNaN(complete)) complete = 'No Progress';
	else complete += '%';

	draw({
		name: name,
		totalFiles: result.length,
		totalTodos: tds.total,
		complete: complete
	});
}

function draw(data){
	$('#projectStats').append(function(){

		var events = addEvent('Total Files', data.totalFiles);
		events += addEvent('Total Todo Items', data.totalTodos);
		events += addEvent('Percent Complete', data.complete);

		var html = '<div class="ui card"><div class=content><div class=header>Project ' + data.name + '</div></div><div class=content><h4 class="ui sub header">Stats</h4><div class="ui small feed">' + events + '</div></div><div class="extra content"><div class="ui floating labeled icon dropdown button links"> <i class="filter icon"></i> <span class="text">Links</span> <div class="menu"> <div class="header"> <i class="tags icon"></i> Filter by Tool </div><a href="#" class="item">Stakeholders</a> <a href="test.html?proj=' + data.name + '" class="item">Tests</a> <a href="dev.html?proj=' + data.name + '" class="item">Development</a> </div></div></div></div>';
		return html;
	});
	$('.links.dropdown').dropdown({
		transition: 'drop'
	})
}

function addEvent(name, value){
	var events = '<div class=event><div class=content><div class=summary>'
	events += name + ': <strong>' + value + '</strong>'; 
	events += '</div></div></div>';
	return events;
}

function todoStats(result){
	var stats = {
		total: 0,
		complete: 0
	};

	function internalStats(todo){
		stats.total++;
		if (todo.complete) stats.complete++;
		for (var i = 0; i < todo.children.length; i++){
			internalStats(todo.children[i]);
		}
	}

	for (var i = 0; i < result.length; i++){
		var g = result[i].group;
		if (g.comments.length > 0){
			for (var j = 0; j < g.comments.length; j++){
				if (!g.comments[j]) continue;
				var td = g.comments[j].todos; // global
				if (td && td.children) {
					for (var k = 0; k < td.children.length; k++){
						internalStats(td.children[k]);
					}
				}
			}
		}
		if (g.children.length > 0){
			for (var j = 0; j < g.children.length; j++){
				if (g.children[j].comments.length > 0){
					for (var k = 0; k < g.children[j].comments.length; k++){
						var td = g.children[j].comments[k];
						if (!td || !td.todos) continue;
						td = td.todos;
						if (td && td.children){
							for (var l = 0; l < td.children.length; l++){
								internalStats(td.children[l]);
							}
						}
					}
				}
				if (g.children[j].comment){
					var td = g.children[j].comment;
					if (!td || !td.todos) continue;
					td = td.todos;
					if (td && td.children){
						for (var l = 0; l < td.children.length; l++){
							internalStats(td.children[l]);
						}
					}
				}
			}
		}
	}
	return stats;
}