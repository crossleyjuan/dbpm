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
	controls.appendTo(controlGroup);
	label.appendTo(row);
	control.appendTo(controls);
	controls.appendTo(row);

	row.appendTo(parent);
};

addButtons= function(parent) {
};

save=function() {
	var controls = $(".data");
	
	var data = {};
	$.each(controls, function(index, value) {
		var control = $(value);
		data[value.name] = control.val();
	});
	var processId = $("#h_id").val();
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
	
	var data = {};
	$.each(controls, function(index, value) {
		var control = $(value);
		data[value.name] = control.val();
	});
	var processId = $("#h_id").val();
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

	var row = $("<div class='row' />");
	var controlGroup = $("<div class='control-group' />");

	var controls = $("<div class='controls' />");
	controls.appendTo(controlGroup);
	var button = $("<input type='button' value='" + element.caption + "' />");
	button.bind('click', element.click);

	button.appendTo(controls);
	controls.appendTo(row);

	row.appendTo(parent);
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

		var form = $("<form id='mainForm' />");

		form.appendTo(content);

		var rows = $("<div class='row-fluid' />");
		rows.appendTo(form);
		$.each(fields, function(index, value) {
			if (value.type == "text") {
				var element = $("<input id='" + value.path + "' name='" + value.path + "' class='data' type='text'>");
				createField(rows, value.caption, value.path, element);
			}
		});
		span.appendTo(title);

		addButton(rows, { caption: 'Salvar', click: save});
		addButton(rows, { caption: 'Siguiente', click: next});

		$.ajax({ url: nodejs + "processdata/" + processId,
			dataType: "json" 
		}).done(function(processData) {
			$("<input type='hidden' id='h_id' name='h_id' value='" + processData["_id"] + "' class='data' />").appendTo(form);
			$("<input type='hidden' id='h_revision' name='h_revision' value='" + processData["_revision"] + "' class='data' />").appendTo(form);

			$.each(fields, function(index, field) {
				var element = $("#" + field.path);
				element.val(processData[field.path]);
			});

		});
	});
}
