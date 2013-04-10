(function($){
	     $.fn.extend({ 
			           
			  render: function(options) {
				//	  Set the default values, use comma to separate the settings, example:
			  var defaults = {
			  }

			  var options =  $.extend(defaults, options);
			  return this.each(function() {
				  var self = this;
				  var o = options;

				  var container = o.container;

				  var control;
				  if (self.type == 'text') {
					  control = $(self).text(o); // $("<input type='text' />");
				  } else if (self.type == 'boolean') {
					  control = $(self).check(o);
				  }
				  control.render();
				  var row = $("<div class='row' />");
				  var controlGroup = $("<div class='control-group' />");

				  var label = $("<label for='" + self.path + "' class='control-label'>" + self.caption + "</label>");
				  var controls = $("<div class='controls' />");

				  var span = $("<span class='span4' />");
				  control.appendTo(controls);
				  controls.appendTo(controlGroup);
				  label.appendTo(span);

				  span.appendTo(row);

				  controls.appendTo(row);

				  row.appendTo(container);
			  });
			  }
		  });

})(jQuery);
