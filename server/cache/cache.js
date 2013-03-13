module.exports = Cache;

function Cache() {
	var self = this;
	self.map = {};
}

Cache.prototype.put = function(key, data) {
	var self = this;
	self.map[key] = data;
}

Cache.prototype.get=function(key) {
	var self = this;
	return self.map[key];
}

Cache.prototype.clean=function() {
	var self = this;
	self.map = {};
}
