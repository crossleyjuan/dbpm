var extendObj = function(childObj, parentObj) {
	var tmpObj = function () {}
	tmpObj.prototype = parentObj.prototype;
	childObj.prototype = new tmpObj();
	childObj.prototype.constructor = childObj;
};

var djon_form = {
	renders: []
};

var base = new function() {
	var self = this;
	self.options = {};
};

base.prototype = {
	baseRender: function(container) {
		var self = this;
		self.render();
		var row = $("<div class='row' />");
		row.appendTo(container);

		var controlGroup = $("<div class='control-group' />");

		if (self.options.label) {
			var label = $("<label for='" + self.options.path + "' class='control-label'>" + self.options.caption + "</label>");
			var span = $("<span class='span4' />");
			span.appendTo(row);

			label.appendTo(span);
		}

		var controls = $("<div class='controls' />");
		//controls.appendTo(controlGroup);
		controls.appendTo(row);

		if (self.options.value) {
			self.control.appendTo(controls);
		}
	},

	appendTo: function(container) {
		var self = this;
		self.control.appendTo(container);
	}
};

createControl = function(options) {
	var result;
	if (options.type == 'text') {
		result = new text(options);
	};
	if (options.type == 'boolean') {
		result = new check(options);
	};
	if (options.type == 'hidden') {
		result = new hidden(options);
	};
	djon_form.renders[options.path] = result;
	return result;
};

getRender = function(id) {
	return djon_form.renders[id];
};
