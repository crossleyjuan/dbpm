var ProcessesModel = function(data) {
	var self = this;

	self.processes = ko.observableArray(ko.utils.arrayMap(data, function(process) {
		console.log(process);
		return { 
			_id: process._id,
			_revision: process._revision,
		   task: process.currentTask.description,
		   taskName: process.currentTask.name,
		   expireDate: new Date(process.expireDate).toString("yyyy-MM-dd"),
			assigned: process.currentUser.fullName
		};
	}));
};

$.ajax({
		url: nodejs + "processes/cross"
}).done(function (allData) {
	var elements = eval(allData);
	ko.applyBindings(new ProcessesModel(elements));
});


