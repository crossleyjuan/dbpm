connect('localhost');
dropNamespace('orfeodb', 'processes');
dropNamespace('orfeodb', 'tasks');
dropNamespace('orfeodb', 'data');

var process = {
	"_id": "edf3e1a5-0839-4c84-921c-d1b357b00d0d",
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

var data =     {
	"_id": "edf3e1a5-0839-4c84-921c-d1b357b00d0d",
	"apellido": "Sanchez",
	"nombre": "Pepe"
}
insert('orfeodb', 'data', data);

//----------------------------
// Otro procesos
//

var processId = uuid();
var process = {
	"_id": processId,
	"currentTask": {
		"description": "Validar derecho de peticion",
		"name": "validar"
	},
	"currentUser": {
		"fullName": "Juan Pablo Crossley",
		"username": "cross"
	},
	"expireDate": "1913-03-25T05:00:00.000Z"
};

insert('orfeodb', 'processes', process);

var task =    {
	"_id": "validar",
	"form": {
		"caption": "Validar derecho de peticion",
		"fields": [
		{
			"caption": "Fecha de radicacion",
			"path": "fecha",
			"required": 0,
			"type": "text"
		},
		{
			"caption": "Ciudadano",
			"path": "nombre",
			"required": 0,
			"type": "text"
		},
		{
			"caption": "Descripcion de documento",
			"path": "descripcionDocumento",
			"required": 0,
			"type": "text"
		}
		]
	},
	"name": "evaluar",
	"process": processId 
};

insert('orfeodb', 'tasks', task);

var data =     {
	"_id": processId,
	"fecha": new Date().toString(),
	"nombre": "Andres Perez",
	"descripcionDocumento": "Derecho de peticion de prueba"
}
insert('orfeodb', 'data', data);

