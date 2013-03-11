var djondb = require("djondb");
var express = require("express");
var uuid = require('node-uuid');
var app = express();
var db = new djondb.WrapConnectionManager();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get("/task/:id", function(req, res, next) {
	console.log("GET: /task/" + req.params.id);

	var conn = db.getConnection("localhost");
	conn.open();

	var results = conn.findByKey("orfeodb", "tasks", req.params.id);
    db.releaseConnection(conn);

    var response = JSON.stringify(results);
	res.header("Content-Length", response.length);
	res.end(response);
});

app.get("/processdata/:id", function(req, res, next) {
	console.log("GET: /processdata/" + req.params.id);

	var conn = db.getConnection("localhost");
	conn.open();

	var results = conn.findByKey("orfeodb", "data", req.params.id);
    db.releaseConnection(conn);

    var response = JSON.stringify(results);
	res.header("Content-Length", response.length);
	res.end(response);
});

app.get("/processes/:user", function(req, res, next) {
	console.log("GET: /processes");

	var conn = db.getConnection("localhost");
	conn.open();

	var results = conn.find("orfeodb", "processes", "$'currentUser.username' == '" + req.params.user + "'");
    db.releaseConnection(conn);

    var response = JSON.stringify(results);
	 console.log("result: " + response);
	res.header("Content-Length", response.length);
	res.end(response);
});

app.listen(50123, function() {
	console.log("Orfeo server listening...");
});
