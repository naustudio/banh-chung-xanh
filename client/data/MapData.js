/* © 2014 nau.com
 * @author Phuong Vo
 *
 */
window.chungapp = window.chungapp || {};
window.chungapp.data = window.chungapp.data || {};

function Position(x, y) {
	if (x && y) {
		this.x = x;
		this.y = y;
	} else {
		this.x = -1;
		this.y = -1;
	}
}

Position.prototype = {
	constructor: Position,

	setData: function(newX, newY) {
		this.x = newX;
		this.y = newY;
	},

	equalWithPosition: function(position) {
		return this.x === position.x && this.y === position.y;
	},

	clone: function() {
		return new Position(this.x, this.y);
	}
};

function MapData() {
	this.initialize();
}

//for parser
MapData.TAG_STATIC_OBJ = 'staticObj';
MapData.TAG_DYNAMID_OBJ = 'dynamidObj';

MapData.TAG_USER = 'user';
MapData.TAG_CHUNG = 'chung';
MapData.TAG_DISK = 'disk';

MapData.TAG_X = 'x';
MapData.TAG_Y = 'y';

//for object in Map
MapData.SPACE_OBJ = -2;
MapData.WALL_OBJ = -1;
MapData.USER_OBJ = 0;
MapData.CHUNG_OBJ = 1;
MapData.DISK_OBJ = 2;
MapData.GROUND_OBJ = 5;

//direction
MapData.DIRECTION_UP = 'up';
MapData.DIRECTION_DOWN = 'down';
MapData.DIRECTION_LEFT = 'left';
MapData.DIRECTION_RIGHT = 'right';

//type moving
MapData.ACTION_NOTHING = 'action_nothing';
MapData.ACTION_MOVING = 'action_moving';
MapData.ACTION_PUSHING_CHUNG = 'action_pushing_chung';

//constant-static for class here
MapData.OBJECT_CONFIG = {
	'-2': 'space',
	'-1': 'wall',
	'0' : 'user',
	'1' : 'banh-chung',
	'2' : 'goal',
	'3' : 'tree',
	'4' : 'rock',
	'5' : 'ground',
	'6' : 'decorator-1',
	'7' : 'decorator-2',
	'8' : 'decorator-3',
	'9' : 'decorator-4',
	'10' : 'decorator-5',
	'11' : 'decorator-6',
	'12' : 'decorator-7',
	'13' : 'decorator-8'
};


//define method, property here
MapData.prototype = {
	constructor: MapData,

	_staticObj: null,
	_userPosition: null,
	_chungItems : null,
	_diskItems : null,

	initialize : function() {
		this._staticObj = [];
		this._userPosition = new Position();
		this._chungItems = [];
		this._diskItems = [];
	},

	/**
	 * [setJSONData description]
	 * @param {[type]} jsonData is map01.json
	 */
	setJSONData : function(jsonData) {
		this._staticObj = jsonData[MapData.TAG_STATIC_OBJ];

		//user
		var userData = jsonData[MapData.TAG_DYNAMID_OBJ][MapData.TAG_USER];
		this._userPosition.setData(userData[MapData.TAG_X], userData[MapData.TAG_Y]);

		var chungData = jsonData[MapData.TAG_DYNAMID_OBJ][MapData.TAG_CHUNG];
		var i = -1;
		for (i = 0; i < chungData.length; i++) {
			var chungItemData= chungData[i];
			var chungObj = new Position(chungItemData[MapData.TAG_X], chungItemData[MapData.TAG_Y]);
			this._chungItems.push(chungObj);
		}

		var diskData = jsonData[MapData.TAG_DYNAMID_OBJ][MapData.TAG_DISK];
		for (i = 0; i < diskData.length; i++) {
			var diskItemData= diskData[i];
			var diskObj = new Position(diskItemData[MapData.TAG_X], diskItemData[MapData.TAG_Y]);
			this._diskItems.push(diskObj);
		}
	},

	resetData : function() {
		this.initialize();
	},

	//get method
	getStaticObjData: function() {
		return this._staticObj;
	},

	getUserPosition: function() {
		return this._userPosition;
	},

	setUserPosition: function(newPosition) {
		this._userPosition = newPosition;
	},

	getChungList: function() {
		return this._chungItems;
	},

	setChungList: function(newChungList) {
		this._chungItems = newChungList;
	},

	getDiskList: function() {
		return this._diskItems;
	},

	setDiskList: function(newDiskList) {
		this._diskItems = newDiskList;
	},

	clone: function() {
		var newMapData = new MapData();
		return newMapData;
	}
};

window.chungapp.data.MapData = MapData;
window.chungapp.data.MapData.Position = Position;
