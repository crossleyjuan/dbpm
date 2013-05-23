var check = function(options) {
	var self = this;
	self.options = options;
	// Show value and label?
	self.options.label = true;
	self.options.value = true;
};

extendObj(check, base);

check.prototype.render = function() {
	var self = this;
	self.control = $("<input id='" + self.options.path + "' type='checkbox' />");
	self.control.addClass("data");
	if (self.options.data != undefined) {
		self.setValue(self.options.data);
	}
};

check.prototype.value = function() {
	var self = this;
	return self.control.is(":checked")? 1: 0;
};

check.prototype.setValue = function(data) {
	var self = this;
	self.control.attr("checked", (data == 1));
};

