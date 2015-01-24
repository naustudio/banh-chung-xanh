/* © 2014 nau.com
 * @author Phuong Vo
 * It represent the Game object
 * It contains:
 * 		+MapData, Map Resolver, MapRender
 * It provides:
 * 		+ the way user integrate with map: move next, undo, store state of game
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

	originalMapData: null,		//store the old data for restart

	initialize : function() {
		this.mapResolver = new chungapp.data.Map();
		this.mapRender = new chungapp.render.MapRender();
		this.originalMapData = new chungapp.data.MapData();
	},

	setJSONMapData: function(mapJSONData) {
		this.originalMapData.setJSONData(mapJSONData);

	},

	startGame: function() {
		this.mapData = this.originalMapData.clone();
		this.mapResolver.setMapData(this.mapData);
		this.mapRenderedHTML = this.mapRender.renderStatic(this.mapData);
	},

	//public method
	goUp: function() {
		console.log(this.mapResolver);
		if (this.mapResolver.canGoUp()) {
			var action = this.mapResolver.goUp();
			if (action !== chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_UP, this.mapData);
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
			if (action !== chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_DOWN, this.mapData);
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
			if (action !== chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_LEFT, this.mapData);
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
			if (action !== chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_RIGHT, this.mapData);
			}

			if (this.mapResolver.isWin()) {
				console.log('==win');
			}
		} else {
			console.log('=can not go right');
		}
	},

	restart: function() {
		this.startGame();
	},

	undo: function() {
		if (this.mapResolver.canUndo()) {
			var direction = this.mapResolver.undo().direction;
			if (direction) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_LEFT, this.mapData);
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
