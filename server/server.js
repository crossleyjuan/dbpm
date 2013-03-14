var djondb = require("djondb");
var express = require("express");
var uuid = require('node-uuid');
var app = express();
var db = new djondb.WrapConnectionManager();
var Cache = require('./cache/cache');

var cache = new Cache();

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
  app.use(express.bodyParser({uploadDir: './uploads'}));
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get("/task/:id", function(req, res, next) {
	console.log("GET: /task/" + req.params.id);

	var response;
	var task = getTask(req.params.id);
	response = JSON.stringify(task);
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


getTask=function(taskName) {

	var task = cache.get("task_" + taskName);
	if (task == undefined) {
		var conn = db.getConnection("localhost");
		conn.open();

		task = conn.findByKey("orfeodb", "tasks", taskName);
		cache.put("task_" + taskName, task);
	}

	if (task != undefined) {
		console.log("getTask(" + taskName + "): " + task.name);
	} else {
		console.log("getTask(" + taskName + "): null");
	}
	return task;
};

getProcess=function(processName) {
	var process = cache.get("process_" + processName);
	if (process == undefined) {
		var conn = db.getConnection("localhost");
		conn.open();

		process = conn.findByKey("orfeodb", "processDefinition", processName);
		cache.put("process_" + processName, process);
	}
	if (process != undefined) {
		console.log("getProcess(" + processName + "): " + process.name);
	} else {
		console.log("getProcess(" + processName + "): null");
	}
	return process;
};

app.post("/process/next/:id/:currentTask", function(req, res, next) {
	console.log("POST: /process/next/" + req.params.id + "/" + req.params.currentTask);

	var conn = db.getConnection("localhost");
	conn.open();

	var data = req.body;

	console.log("body: "+ JSON.stringify(data));

	var currentTask = getTask(req.params.currentTask);

	var processDef = getProcess(currentTask.processName);

	var tasks = processDef.task;
	var found = false;
	var nextTask;
	console.log("currentTask: " + JSON.stringify(currentTask));
	for (var x = 0; x < tasks.length; x++) {
		var task = tasks[x];
		console.log("task: " + task.name);
		if (found) {
			nextTask = getTask(task.name);
			console.log("nextTask: " + task);
			break;
		}
		if (task.name == currentTask.name) {
			found = true;
		}
	};

	var processData = conn.findByKey('orfeodb', 'processes', data["h_id"]);

	if (nextTask != undefined) {
		processData.currentTask = {
			description: nextTask.description,
			name: nextTask.name
		};
		processData.status = 'open';
	} else {
		processData.currentTask = {};
		processData.status = 'closed';
	}
	conn.update("orfeodb", "processes", processData);

	var resultData = {};
	for (var i in data) {
		if (i == "h_id") {
			resultData["_id"] = data[i];
		} else if (i == "h_revision") {
			resultData["_revision"] = data[i];
		} else {
			resultData[i] = data[i];
		}
	}

	conn.update("orfeodb", "data", resultData);

	db.releaseConnection(conn);

	var response = JSON.stringify(processData);
	res.header("Content-Length", response.length);
	res.end(response);
	console.log(response);
});

app.get("/process/createCase/:process", function(req, res, next) {
	console.log("POST: /process/createCase/" + req.params.process);

	var conn = db.getConnection("localhost");
	conn.open();

	var data = req.body;

	var processName = req.params.process;

	var processDef = getProcess(processName);
	var processId = uuid.v1();
	var firstTask = getTask(processDef.task[0].name);
	var process = {
		_id: processId,
		process: processName,
		currentTask: {
			description: firstTask.description,
			name: firstTask.name 
		},
		currentUser: {
			fullName: "Juan Pablo Crossley",
			username: "cross"
		},
		status: "open",
		expireDate: "1913-03-25T05:00:00.000Z"
	};
	conn.insert('orfeodb', 'processes', process);

	var data = {_id: processId};
	conn.insert('orfeodb', 'data', data);

	db.releaseConnection(conn);

	var response = JSON.stringify(process);
	res.header("Content-Length", response.length);
	res.end(response);
	console.log(response);
});

app.post("/process/save/:id/:currentTask", function(req, res, next) {
	console.log("POST: /process/save");

	var conn = db.getConnection("localhost");
	conn.open();

	var data = req.body;

	var resultData = {};
	for (var i in data) {
		if (i == "h_id") {
			resultData["_id"] = data[i];
		} else if (i == "h_revision") {
			resultData["_revision"] = data[i];
		} else {
			resultData[i] = data[i];
		}
	}

	try {
		conn.update("orfeodb", "data", resultData);
	} catch (e) {
		console.error(e);
	}

	db.releaseConnection(conn);

	var response = JSON.stringify({ result: "success"});

	res.header("Content-Length", response.length);
	res.end(response);
	console.log(response);
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

app.get("/processDefinition", function(req, res, next) {
	console.log("GET: /processDefinition");

	var conn = db.getConnection("localhost");
	conn.open();

	var results = conn.find("orfeodb", "processDefinition");
	db.releaseConnection(conn);

	var response = JSON.stringify(results);
	console.log("result: " + response);
	res.header("Content-Length", response.length);
	res.end(response);
});

app.listen(50123, function() {
	console.log("Orfeo server listening...");
});
