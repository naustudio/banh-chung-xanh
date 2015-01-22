/* © 2014 nau.com
 * @author Phuong Vo
 *
 */
/*global chungapp:true, data:true, render:true*/
chungapp = chungapp || {};
data = chungapp.data || {};
render = chungapp.render || {};

function Game(map) {
	this.initData(map);
}

//define method, property here
Game.prototype = {
	constructor: Game,

	mapData: null,
	mapRender: null,
	mapRenderedHTML: null,
	map: null,

	initData: function(map) {
		this.mapData = new chungapp.data.Map(map);
		this.mapRender = new chungapp.render.MapRender();
		if (map) {
			this.map = this._cloneMap(map);

			this.mapRenderedHTML = this.mapRender.renderStatic(this.mapData.getMapData(),
				this.mapData.getUserPosition(), this.mapData.getChungList(), this.mapData.getDiskList());
		}
	},

	_cloneMap : function(map) {
		var newMap = [];
		for (var i = 0; i < map.length; i++) {
			var row = map[i];
			var newRow = [];
			for (var j = 0; j < row.length; j++) {
				newRow.push(row[j]);
			}

			newMap.push(newRow);
		}

		return newMap;
	},

	setMapData: function(map) {
		this.map = this._cloneMap(map);
		this.mapData.setMapData(map);
		this.mapRenderedHTML = this.mapRender.renderStatic(this.mapData.getMapData(),
				this.mapData.getUserPosition(), this.mapData.getChungList(), this.mapData.getDiskList());
	},

	//public method
	goUp: function() {
		console.log(this.mapData);
		if (this.mapData.canGoUp()) {
			var action = this.mapData.goUp();
			if (action === chungapp.data.Map.ACTION_NOTHING) {
				this.mapRender.renderSteps(Map.DIRECTION_UP, this.mapData.getUserPosition(),
					this.mapData.getChungList());
			}

			if (this.mapData.isWin()) {
				console.log('==win==');
			}
		} else {
			console.log('=can not go up');
		}
	},

	goDown: function() {
		if (this.mapData.canGoDown()) {
			var action = this.mapData.goDown();
			if (action === chungapp.data.Map.ACTION_NOTHING) {
				this.mapRender.renderSteps(Map.DIRECTION_DOWN, this.mapData.getUserPosition(),
					this.mapData.getChungList());
			}

			if (this.mapData.isWin()) {
				console.log('==win');
			}
		} else {
			console.log('=can not go down');
		}
	},

	goLeft: function() {
		if (this.mapData.canGoLeft()) {
			var action = this.mapData.goLeft();
			if (action === chungapp.data.Map.ACTION_NOTHING) {
				this.mapRender.renderSteps(Map.DIRECTION_LEFT, this.mapData.getUserPosition(),
					this.mapData.getChungList());
			}

			if (this.mapData.isWin()) {
				console.log('==win');
			}
		} else {
			console.log('=can not go left');
		}
	},

	goRight: function() {
		if (this.mapData.canGoRight()) {
			var action = this.mapData.goRight();
			if (action === chungapp.data.Map.ACTION_NOTHING) {
				this.mapRender.renderSteps(Map.DIRECTION_RIGHT, this.mapData.getUserPosition(),
					this.mapData.getChungList());
			}

			if (this.mapData.isWin()) {
				console.log('==win');
			}
		} else {
			console.log('=can not go right');
		}
	},

	restart: function() {
		this.setMapData(this.map);
	},

	undo: function() {
		if (this.mapData.canUndo()) {
			var direction = this.mapData.undo().direction;
			if (direction) {
				this.mapRender.renderSteps(Map.DIRECTION_LEFT, this.mapData.getUserPosition(),
					this.mapData.getChungList());
			} else {
				console.log('can not find direction');
			}
		} else {
			console.log('can not undo');
		}
	},

	getNumStep: function() {
		return this.mapData.getHistoryNum();
	}
};

chungapp.Game = Game;
