(function($){
	     $.fn.extend({ 
			           
			  check: function(options) {
				  var self = this;

				  //	  Set the default values, use comma to separate the settings, example:
				  var defaults = {
				  }

				  var options =  $.extend(defaults, options);

				  self.render = function() {
					  self.innerControl = $("<input type='checkbox' />");
				  	  self.innerControl.addClass("data");
				  	  self.innerControl.attr("id", self.path);
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
					  return innerControl.is(":checked");
				  }
				  
				  self.setValue = function(check) {
					  return innerControl.attr("checked", "checked");
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

