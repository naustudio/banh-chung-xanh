/* © 2014 nau.com
 * @author Phuong Vo
 *
 */
/*global chungapp:true, data:true, render:true*/
chungapp = chungapp || {};
data = chungapp.data || {};
render = chungapp.render || {};

function Game() {
	this.initialize();
}

//define method, property here
Game.prototype = {
	constructor: Game,

	mapRenderedHTML: null,

	mapResolver: null,
	mapData: null,
	mapRender: null,

	initialize : function() {
		this.mapResolver = new chungapp.data.Map();
		this.mapRender = new chungapp.render.MapRender();
		this.mapData = new chungapp.data.MapData();
	},

	setJSONMapData: function(mapJSONData) {
		this.mapData.setJSONData(mapJSONData);
		this.mapResolver.setMapData(this.mapData);
		this.mapRenderedHTML = this.mapRender.renderStatic(this.mapResolver.getMapData(),
				this.mapResolver.getUserPosition(), this.mapResolver.getChungList(), this.mapResolver.getDiskList());
	},

	startGame: function() {
		this.mapRenderedHTML = this.mapRender.renderStatic(this.mapResolver.getMapData(),
				this.mapResolver.getUserPosition(), this.mapResolver.getChungList(), this.mapResolver.getDiskList());
	},

	//public method
	goUp: function() {
		console.log(this.mapResolver);
		if (this.mapResolver.canGoUp()) {
			var action = this.mapResolver.goUp();
			if (action === chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_UP, this.mapResolver.getUserPosition(),
					this.mapResolver.getChungList());
			}

			if (this.mapResolver.isWin()) {
				console.log('==win==');
			}
		} else {
			console.log('=can not go up');
		}
	},

	goDown: function() {
		if (this.mapResolver.canGoDown()) {
			var action = this.mapResolver.goDown();
			if (action === chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_DOWN, this.mapResolver.getUserPosition(),
					this.mapResolver.getChungList());
			}

			if (this.mapResolver.isWin()) {
				console.log('==win');
			}
		} else {
			console.log('=can not go down');
		}
	},

	goLeft: function() {
		if (this.mapResolver.canGoLeft()) {
			var action = this.mapResolver.goLeft();
			if (action === chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_LEFT, this.mapResolver.getUserPosition(),
					this.mapResolver.getChungList());
			}

			if (this.mapResolver.isWin()) {
				console.log('==win');
			}
		} else {
			console.log('=can not go left');
		}
	},

	goRight: function() {
		if (this.mapResolver.canGoRight()) {
			var action = this.mapResolver.goRight();
			if (action === chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_RIGHT, this.mapResolver.getUserPosition(),
					this.mapResolver.getChungList());
			}

			if (this.mapResolver.isWin()) {
				console.log('==win');
			}
		} else {
			console.log('=can not go right');
		}
	},

	restart: function() {
		console.log('in progress');
	},

	undo: function() {
		if (this.mapResolver.canUndo()) {
			var direction = this.mapResolver.undo().direction;
			if (direction) {
				this.mapRender.renderSteps(MapData.DIRECTION_LEFT, this.mapResolver.getUserPosition(),
					this.mapResolver.getChungList());
			} else {
				console.log('can not find direction');
			}
		} else {
			console.log('can not undo');
		}
	},

	getNumStep: function() {
		return this.mapResolver.getHistoryNum();
	}
};

chungapp.Game = Game;
