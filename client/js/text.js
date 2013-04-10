(function($){
	     $.fn.extend({ 
			           
			  text: function(options) {
				  var self = this;

				  //	  Set the default values, use comma to separate the settings, example:
				  var defaults = {
				  }

				  var options =  $.extend(defaults, options);

				  self.render = function() {
					  self.innerControl = $("<input type='text' />");
				  	  self.innerControl.addClass("data");
				  	  options.container.attr("id", self[0].path);
				  }

				  self.init = function(options) {
				  }

				  self.control = function() {
					  return self.innerControl;
				  }

				  self.appendTo = function(container) {
					  self.innerControl.appendTo(container);
				  }

				  self.value = function() {
					  return innerControl.val();
				  }

				  self.setValue = function(value) {
					  return innerControl.val(value);
				  }
				  return this;
				  /*
				  return this.each(function() {
					  var self = this;
					  var o = options;

					  var container = o.container;

					  return control[0];
				  });
				  */
			  }
		  });

})(jQuery);

