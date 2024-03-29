var djondb = require("djondb");
var express = require("express");
var uuid = require('node-uuid');
var app = express();
var db = new djondb.WrapConnectionManager();
var Cache = require('./cache/cache');
var fs = require('fs');
var mime = require('mime');

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
  if (!fs.existsSync('./uploads')) {
	  fs.mkdir('./uploads');
  }
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

	var results = conn.executeQuery("select * from djondb:data where $'_id' == '" + req.params.id + "'");

	db.releaseConnection(conn);

	var response = JSON.stringify(results);
	res.header("Content-Length", response.length);
	res.end(response);
});


getTask=function(taskName) {
	console.log("getTask " + taskName);

	var task = cache.get("task_" + taskName);
	if (task == undefined) {
		var conn = db.getConnection("localhost");
		conn.open();

		var tasks = conn.executeQuery("select * from djondb:tasks where $'_id' == '" + taskName + "'");
		if (tasks.length > 0) task = tasks[0];

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
	console.log("getProcess(" + processName + ")");
	var result = cache.get("process_" + processName);
	if (result == undefined) {
		var conn = db.getConnection("localhost");
		conn.open();

	   var p = conn.executeQuery("select * from djondb:processDefinition where $'_id' == '" + processName + "'");
		if (p.length > 0) result = p[0];

		cache.put("process_" + processName, result);
	}
	if (result != undefined) {
		console.log("getProcess(" + processName + "): " + result.name);
	} else {
		console.log("getProcess(" + processName + "): null");
	}
	return result;
};

app.post("/process/next/:id/:currentTask", function(req, res, next) {
	console.log("POST: /process/next/" + req.params.id + "/" + req.params.currentTask);

	var conn = db.getConnection("localhost");
	conn.open();

	var data = req.body;
	console.log(req.files);

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

	var processDatas = conn.executeQuery("select * from djondb:processes where $'_id' == '" + data["_id"] + "'");
	var processData = {};
	if (processDatas.length > 0) processData = processDatas[0];

	if (nextTask != undefined) {
		processData.currentTask = {
			description: nextTask.description,
			name: nextTask.name
		};
		processData.status = 'open';
	} else {
		processData.currentTask = { s: 1};
		processData.status = 'closed';
	}
	console.log("doing update: " + JSON.stringify(processData));
	conn.executeUpdate("update " + JSON.stringify(processData) + " into djondb:processes");

	var resultData = conn.executeQuery("select * from djondb:data where $'_id' == '" + req.params.id + "'");
	if (resultData.length > 0) resultData = resultData[0]; else resultData = {};

	for (var i in data) {
		if (i == "_id") {
			resultData["_id"] = data[i];
		} else if (i == "_revision") {
			resultData["_revision"] = data[i];
		} else {
			resultData[i] = data[i];
		}
	}

	console.log("doing update: " + JSON.stringify(resultData));
	conn.executeUpdate("update " + JSON.stringify(resultData) + " into djondb:data");

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
	conn.executeUpdate("insert " + JSON.stringify(process) + " into djondb:processes");

	var data = {_id: processId};
	conn.executeUpdate("insert " + JSON.stringify(data) + " into djondb:data");

	db.releaseConnection(conn);

	console.log("Case created. process: " + JSON.stringify(process) + ", data: " + JSON.stringify(data));
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

	var resultData = conn.executeQuery("select * from djondb:data where $'_id' == '" + req.params.id + "'");
	if (resultData.length > 0) resultData = resultData[0]; else resultData = {};

	for (var i in data) {
		if (i == "_id") {
			resultData["_id"] = data[i];
		} else if (i == "_revision") {
			resultData["_revision"] = data[i];
		} else {
			resultData[i] = data[i];
		}
	}

	try {
		conn.executeUpdate("update " + JSON.stringify(resultData) + " into djondb:data");

		console.log("save: " + JSON.stringify(resultData));
	} catch (e) {
		console.error(e);
	}

	db.releaseConnection(conn);

	var response = JSON.stringify({ result: "success"});

	res.header("Content-Length", response.length);
	res.end(response);
	console.log(response);
});

createFolder=function(folder) {
	var spath = folder.split('/');
	var fullpath = '.';
	for (var x in spath) {
		fullpath += '/' + spath[x];
		if (!fs.existsSync(fullpath)) {
			fs.mkdirSync(fullpath);
		}
	}
}

app.post("/process/upload/:processId/:taskName", function(req, res, next) {
	console.log("POST: /process/upload");

	var processId = req.params.processId;
	var taskName = req.params.taskName;

	console.log(req.files);
	var tmp_path = req.files.file.path;
	var target_folder = './public/files/' + processId;
	var target_path = target_folder + '/' + req.files.file.name;
	console.log('target: ' + target_path);
	createFolder(target_folder);
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		fs.unlink(tmp_path, function() {
		});
	});

	var conn = db.getConnection("localhost");
	conn.open();

	var data = conn.executeQuery("select * from djondb:data where $'_id' == '" + processId + "'");
	if (data.length > 0) data = data[0]; else data = {};

	if (data.files == undefined) {
		data.files = [];
	}
	var file = {};
	file.name = req.files.file.name;
	file.fileName = processId + '/' + file.name;
	data.files.push(file);
	conn.executeUpdate("update " + JSON.stringify(data) + " into djondb:data");

	console.log('data with file', JSON.stringify(data));

	db.releaseConnection(conn);

	var response = "{ result: 'success' }";
	res.header("Content-Length", response.length);
	res.end(response);
});

app.get("/process/file/:processId/:fileName", function(req, res, next) {
	console.log("GET: /process/file");

	var processId = req.params.processId;
	var fileName = req.params.fileName;

	var conn = db.getConnection("localhost");
	conn.open();

	var data = conn.executeQuery("select * from djondb:data where $'_id' == '" + processId + "'");
	if (data.length > 0) data = data[0]; else data = {};

	console.log(JSON.stringify(data));

	var folder = './public/files/' + processId;
	for (var i in data.files) {
		var val = data.files[i];
		console.log("val: " + JSON.stringify(val));
		if (val.name == fileName) {
			var file = './public/files/' + val.fileName;
			res.download(file);
			/*
				var mime = mime.lookup(file);
				res.setHeader('Content-disposition', 'attachment; filename=' + val.name);
				res.setHeader('Content-type', mime);

				var fileStream = fs.createReadStream(file);
				fileStream.pipe(res);
				*/
			return false;
		}
	};
});

app.get("/processes/:user", function(req, res, next) {
	console.log("GET: /processes");

	var conn = db.getConnection("localhost");
	conn.open();

	var results = conn.executeQuery("select * from djondb:processes where $'currentUser.username' == '" + req.params.user + "' and $'status' != 'closed'");
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

	var results = conn.executeQuery("select * from djondb:processDefinition");
	db.releaseConnection(conn);

	var response = JSON.stringify(results);
	console.log("result: " + response);
	res.header("Content-Length", response.length);
	res.end(response);
});

app.listen(50123, function() {
	console.log("Djondb test server listening...");
});
