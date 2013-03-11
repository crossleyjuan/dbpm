connect('localhost');
dropNamespace('orfeodb', 'processes');
dropNamespace('orfeodb', 'tasks');

var process = {
	"_id": "edf3e1a5-0839-4c84-921c-d1b357b00d0d",
	"_revision": "4c0f8a1c-8cd8-42c3-8c81-5610a091afd2",
	"_status": 1,
	"currentTask": {
		"description": "Evaluar demanda",
		"name": "evaluar"
	},
	"currentUser": {
		"fullName": "Juan Pablo Crossley",
		"username": "cross"
	},
	"expireDate": "1913-03-25T05:00:00.000Z"
};

insert('orfeodb', 'processes', process);

var task =    {
	"_id": "evaluar",
	"_revision": "9f0245f3-72e3-4e51-81d3-3510c5853f4a",
	"_status": 1,
	"form": {
		"caption": "Evaluar demanda",
		"fields": [
		{
			"caption": "Nombre",
			"path": "nombre",
			"required": 0,
			"type": "text"
		},
		{
			"caption": "Apellido",
			"path": "apellido",
			"required": 0,
			"type": "text"
		}
		]
	},
	"name": "evaluar",
	"process": "edf3e1a5-0839-4c84-921c-d1b357b00d0d"
};

insert('orfeodb', 'tasks', task);

