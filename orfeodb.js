connect('localhost');
dropNamespace('orfeodb', 'processDefinition');
dropNamespace('orfeodb', 'processes');
dropNamespace('orfeodb', 'tasks');
dropNamespace('orfeodb', 'data');

//
// Metadata
//
//

//************************************************
// Demandas 
//************************************************
var processDef = {
	"_id": "Demandas",
	"name": "Demandas",
	"description": "Radicacion de demadas",
	"task": 
	[
		{ "name": "evaluar"  },
	   { "name": "aprobar" }
	]
};
insert('orfeodb', 'processDefinition', processDef);

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
		},
		{
			"caption": "Observaciones",
			"path": "observaciones",
			"required": 0,
			"type": "text"
		}
		]
	},
	"name": "evaluar",
	"description": "Evaluar demanda",
	"processName": "Demandas"
};
insert('orfeodb', 'tasks', task);

var task =    {
	"_id": "aprobar",
	"form": {
		"caption": "Aprobar demanda",
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
		},
		{
			"caption": "Observaciones",
			"path": "observaciones",
			"required": 0,
			"type": "text"
		},
		{
			"caption": "Aprobar",
			"path": "aprobar",
			"required": 0,
			"type": "boolean"
		}
		]
	},
	"name": "aprobar",
	"description": "Aprobar demanda",
	"processName": "Demandas"
};
insert('orfeodb', 'tasks', task);


//************************************************
// Derechos de peticion
//************************************************
var processDef = {
	"_id": "DerPeticion",
	"name": "DerPeticion",
	"description": "Derechos de peticion",
	"task": 
	[
		{ "name": "validar"  },
	   { "name": "aprobarPeticion" }
	]
};
insert('orfeodb', 'processDefinition', processDef);

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
	"name": "validar",
	"description": "Evaluar derecho de peticion",
	"processName": "DerPeticion"
};
insert('orfeodb', 'tasks', task);

var task =    {
	"_id": "aprobarPeticion",
	"name": "aprobarPeticion",
	"description": "Aprobar derecho de peticion",
	"processName": "DerPeticion",
	"form": {
		"caption": "Aprobar derecho de peticion",
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
		},
		{
			"caption": "Aprobado",
			"path": "aprobado",
			"required": 0,
			"type": "boolean"
		},
		{
			"caption": "Observaciones",
			"path": "observaciones",
			"required": 0,
			"type": "text"
		}
		]
	}
};
insert('orfeodb', 'tasks', task);


//****************************************************
// Data
//
/*
var process = {
	"_id": "edf3e1a5-0839-4c84-921c-d1b357b00d0d",
	"process": "Demadas",
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

var data =     {
	"_id": "edf3e1a5-0839-4c84-921c-d1b357b00d0d",
	"apellido": "Sanchez",
	"nombre": "Pepe"
}
insert('orfeodb', 'data', data);

var processId = uuid();
var process = {
	"_id": processId,
	"process": "DerPeticion",
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
var data =     {
	"_id": processId,
	"fecha": new Date().toString(),
	"nombre": "Andres Perez",
	"descripcionDocumento": "Derecho de peticion de prueba"
}
insert('orfeodb', 'data', data);
*/
