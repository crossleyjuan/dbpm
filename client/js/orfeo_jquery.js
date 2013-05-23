// This will apply date picker plugin
$(".datepicker").datepicker();

function get(name){
	   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
			      return decodeURIComponent(name[1]);
}

createField= function(parent, caption, path, control) {
	var row = $("<div class='row' />");
	var controlGroup = $("<div class='control-group' />");

	var label = $("<label for='" + path + "' class='control-label'>" + caption + "</label>");
	var controls = $("<div class='controls' />");

	var span = $("<span class='span4' />");
	control.appendTo(controls);
	controls.appendTo(controlGroup);
	label.appendTo(span);

	span.appendTo(row);

	controls.appendTo(row);

	row.appendTo(parent);
};

loadNewCase=function() {
	var urlPost = nodejs + "processDefinition"; 
	$.ajax({
		url:  urlPost,
		dataType: "json"
	}).done(function(data) {
		var div = $("#newcase");

		var span = $("<span class='process title'>Crear</span>").appendTo(div);
		var urlCreate = nodejs + "process/createCase/";
		var ul = $("<div class='title' />");
		ul.appendTo(div);
		$.each(data, function(index, procDef) {
			var url = urlCreate + procDef.name;
			var anchor = $("<a href='javascript:void(0);' class='cases btn btn-primary'>" + procDef.description + "</a>");
			anchor.bind("click", function() {
				$.ajax({
					url: url,
					dataType: "json"
				}).done(function(data) {
					window.location.href = serverUrl + 'load.htm?processId=' + data["_id"] + '&taskName=' + data.currentTask.name;
				});
			});
			anchor.appendTo(ul);
		});
	});
}

collectData=function() {
	var controls = $(".data");
	var data = {};
	$.each(controls, function(index, element) {
		var control = getRender(element.id);
		if (control != undefined) {
			data[element.id] = control.value();
		}
	});
	return data;
};

save=function() {
	var controls = $(".data");
	
	var data = collectData();

	var processId = data["_id"];
	var taskId = get("taskName");
	var urlPost = nodejs + "process/save/" + processId + "/" + taskId; 
	$.ajax({
		url: urlPost,
		dataType: "json",
		type: "POST",
		data: data
	}).done(function(data) {
		window.location.href = serverUrl + 'load.htm?processId=' + processId + '&taskName=' + taskId;
	});
};

getControlValue=function(controlName) {
	var control = $("#" + controlName);
	return control.val();
};

next=function() {
	var controls = $(".data");

	var data = collectData();

	var processId = data["_id"];
	var taskId = get("taskName");
	var urlPost = nodejs + "process/next/" + processId + "/" + taskId; 
	$.ajax({
		url: urlPost,
		dataType: "json",
		type: "POST",
		data: data
	}).done(function(data) {
		var processId = data["_id"];
		if (data.status == 'open') {
			var task = data.currentTask.name;
			window.location.href = serverUrl + 'load.htm?processId=' + processId + '&taskName=' + task;
		} else {
			window.location.href = serverUrl + 'index.htm';
		}
	});
};

addButton= function(parent, element) {
	var self = this;

	var button = $("<a class='btn btn-primary'>" + element.caption + "<a/>");
	button.bind('click', element.click);

	button.appendTo(parent);
}

loadTask= function() {
	var taskId = get("taskName");

	$.ajax({ url: nodejs + "task/" + taskId,
		dataType: "json"
	}).done(function(data) {
		var self = this;
		self.formDef = data.form;
		var content = $("#form");
		var title = $("#title");
		var span = $("<span>" + self.formDef.caption + "</span>");
		var fields = self.formDef.fields;
		var processId = get("processId");

		var form = $("<form id='mainForm' class='form-horizontal' />");

		form.appendTo(content);

		var rows = $("<div class='row-fluid' />");
		rows.appendTo(form);
		$.each(fields, function(index, value) {
			var element = createControl(value);
			element.baseRender(rows);
		});
		span.appendTo(title);

		var actions = $("<div class='form-actions'>").appendTo(form);
		addButton(actions, { caption: 'Salvar', click: save});
		addButton(actions, { caption: 'Siguiente', click: next});

		$.ajax({ url: nodejs + "processdata/" + processId,
			dataType: "json" 
		}).done(function(processData) {
			createControl({type: 'hidden', path:'_id', data: processData["_id"]}).baseRender(rows);
			createControl({type: 'hidden', path:'_revision', data: processData["_revision"]}).baseRender(rows);

			$.each(fields, function(index, field) {
				var element = getRender(field.path);
				if (element != undefined) {
					element.setValue(processData[field.path]);
				}
			});

		});
	});
}
