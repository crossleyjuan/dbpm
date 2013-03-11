var serverUrl = "http://localhost:50123/addressbook/";

var ContactsModel = function(contacts) {
	var self = this;

	self.phoneOptions = ko.observableArray(['home phone', 'mobile phone', 'work phone']);
	self.addressOptions = ko.observableArray(['home address', 'work address']);
	self.genderOptions = ko.observableArray(['','Male', 'Female']);

	self.contacts = ko.observableArray(ko.utils.arrayMap(contacts, function(contact) {
		return { 
			_id: contact._id,
		_revision: contact._revision,
		name: {
			first: contact.name.first, 
		last: contact.name.last, 
		nick: contact.name.nick
		}, 
		gender: contact.gender,
		phones: ko.observableArray(contact.phones), 
		addresses: ko.observableArray(contact.addresses) 
		};
	}));

	self.addContact = function() {
		self.contacts.push({
			_id: "",
			_revision: "",
			name: { 
				first: "",
			last: "",
			nick: ""},
			gender: "",
			phones: ko.observableArray([{label: "", number: ""}]),
			addresses: ko.observableArray([{label: "", number: "", street: "", city: "", state: "", zip: "", country: ""}])
		});
	};

	self.removeContact = function (contact) {
		if (contact._id == "") {
			self.contacts.remove(contact);
		} else {
			$.ajax({
				type: "DELETE",
				url: serverUrl + contact._id + "/" + contact._revision,
				success: function () {
					self.contacts.remove(contact);
				},
				failure: function (errMsg) { console.log(errMsg); }
			});
		}
	};

	self.updateContact = function (contact) {
		if (contact._id == "") {
			$.ajax({
				type: "POST",
				url: serverUrl,
				data: ko.toJSON(contact),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (retData) {
					contact._id = retData["_id"];
				},
				failure: function (errMsg) { console.log(errMsg); }
			});
		} else {
			$.ajax({
				type: "PUT",
				url: serverUrl + contact._id,
				data: ko.toJS(contact),
				success: function () { },
				failure: function (errMsg) { console.log(errMsg); }
			});
		}
	};

	self.addPhone = function(contact) {
		contact.phones.push({
			label: "",
			number: ""
		});
	};

	self.addAddress = function(contact) {
		contact.addresses.push({
			label: "",
			number: "",
			street: "",
			city: "",
			state: "",
			zip: "",
			country: ""
		});
	};

	self.removePhone = function(phone) {
		$.each(self.contacts(), function() { this.phones.remove(phone) })
	};

	self.removeAddress = function(address) {
		$.each(self.contacts(), function() { this.addresses.remove(address) })
	};

	self.saveToJSON = function() {
		self.lastSavedJson(JSON.stringify(ko.toJS(self.contacts), null, 2));
	};

	self.lastSavedJson = ko.observable("");
};

$.getJSON(serverUrl, function (allData) {
	ko.applyBindings(new ContactsModel(allData));
});


