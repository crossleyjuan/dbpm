var hidden = function(options) {
	var self = this;
	self.options = options;
	// Show value and label?
	self.options.value = true;
	self.options.label = false;
};

extendObj(hidden, base);

hidden.prototype.render = function() {
	var self = this;
	self.control = $("<input id='" + self.options.path + "' type='hidden' />");
	self.control.addClass("data");
	if (self.options.data != undefined) {
		self.setValue(self.options.data);
	}
};

hidden.prototype.appendTo = function(container) {
	var self = this;
	self.control.appendTo(container);
};

hidden.prototype.value = function() {
	var self = this;
	return self.control.val();
};

hidden.prototype.setValue = function(data) {
	var self = this;
	self.control.val(data);
};


