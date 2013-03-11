var serverUrl = "http://localhost:50123/";
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
	alert('save');
};

next=function() {
	alert('next');
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

	$.ajax({ url: serverUrl + "task/" + taskId,
		dataType: "json"
	}).done(function(data) {
		var self = this;
		self.form = data.form;
		var content = $("#form");
		var title = $("#title");
		var span = $("<span>" + self.form.caption + "</span>");
		var fields = self.form.fields;
		var rows = $("<div class='row-fluid' />");
		rows.appendTo(content);
		$.each(fields, function(index, value) {
			if (value.type == "text") {
				var element = $("<input id='" + value.path + "' class='data' type='text'>");
				createField(rows, value.caption, value.path, element);
			}
		});
		span.appendTo(title);

		addButton(rows, { caption: 'Salvar', click: save});
		addButton(rows, { caption: 'Siguiente', click: next});

		$.ajax({ url: serverUrl + "processdata/" + get("processId"),
			dataType: "json" 
		}).done(function(processData) {
			$.each(fields, function(index, field) {
				var element = $("#" + field.path);
				element.val(processData[field.path]);
			});

		});
	});
}
