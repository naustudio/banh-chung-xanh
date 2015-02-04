/* © 2014 nau.com
 * @author Phuong Vo
 * It represent the Game object
 * It contains:
 * 		+MapData, Map Resolver, MapRender
 * It provides:
 * 		+ the way user integrate with map: move next, undo, store state of game
 */
/*global chungapp:true, data:true, render:true, ga:true*/
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

	mapId: null,

	startTime: null,

	originalMapData: null,		//store the old data for restart

	initialize : function() {
		this.mapResolver = new chungapp.data.Map();
		this.mapRender = new chungapp.render.MapRender();
		this.originalMapData = new chungapp.data.MapData();
	},

	setJSONMapData: function(mapJSONData, mapId) {
		this.originalMapData.setJSONData(mapJSONData);

		this.mapId = mapId;
	},

	startGame: function() {
		this.mapData = this.originalMapData.clone();
		this.mapResolver.setMapData(this.mapData);
		this.mapRenderedHTML = this.mapRender.renderStatic(this.mapData);

		//store the start time
		this.startTime = new Date();
		console.log(this.startTime);

		///_------------------trackEvent startGame -------------------
		ga('send', 'event', 'startGame - Map: ' + this.mapId, this.startTime);
	},

	endGame: function(lastDirection) {
		var currentTime = new Date();
		var timeElapsed = currentTime.getTime() - this.startTime.getTime();
		var usedStep = this.getNumStep();

		//log the step
		var historiesStep = this.mapResolver.getHistoriesStep();
		historiesStep.push(lastDirection);
		console.log('historiesStep >>> ' + historiesStep);

		///_------------------trackEvent endGame -------------------
		ga('send', 'event', 'endWinGame - Map: ' + this.mapId, currentTime);
		ga('send', 'event', 'timeElapsed - Map: ' + this.mapId,  timeElapsed + ' Minutes');
		ga('send', 'event', 'gameAttempt - Map: ' + this.mapId,  usedStep + ' Steps');

		return {
			'mapIndex' : this.mapId,
			'elapsedTime' : timeElapsed.toString(),
			'usedSteps' : usedStep
		};
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
				return this.endGame(chungapp.data.MapData.DIRECTION_UP);
			}
		} else {
			console.log('=can not go up');
		}

		return null;	//still not win or can not go up
	},

	goDown: function() {
		if (this.mapResolver.canGoDown()) {
			var action = this.mapResolver.goDown();
			if (action !== chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_DOWN, this.mapData);
			}

			if (this.mapResolver.isWin()) {
				return this.endGame(chungapp.data.MapData.DIRECTION_DOWN);
			}
		} else {
			console.log('=can not go down');
		}

		return null;
	},

	goLeft: function() {
		if (this.mapResolver.canGoLeft()) {
			var action = this.mapResolver.goLeft();
			if (action !== chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_LEFT, this.mapData);
			}

			if (this.mapResolver.isWin()) {
				return this.endGame(chungapp.data.MapData.DIRECTION_LEFT);
			}
		} else {
			console.log('=can not go left');
		}

		return null;
	},

	goRight: function() {
		if (this.mapResolver.canGoRight()) {
			var action = this.mapResolver.goRight();
			if (action !== chungapp.data.MapData.ACTION_NOTHING) {
				this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_RIGHT, this.mapData);
			}

			if (this.mapResolver.isWin()) {
				return this.endGame(chungapp.data.MapData.DIRECTION_RIGHT);
			}
		} else {
			console.log('=can not go right');
		}

		return null;
	},

	restart: function() {
		this.mapData = this.originalMapData.clone();
		this.mapResolver.setMapData(this.mapData);
		this.mapRender.renderSteps(chungapp.data.MapData.DIRECTION_RIGHT, this.mapData);
	},

	undo: function() {
		if (this.mapResolver.canUndo()) {
			var result = this.mapResolver.undo();
			if (result.action !== chungapp.data.MapData.ACTION_NOTHING) {
				console.log('==== userPosition = ' + this.mapData.getUserPosition());
				window.userPos = this.mapData.getUserPosition();
				console.log('==== chungList = ' + this.mapData.getChungList());
				window.chungList = this.mapData.getChungList();
				this.mapRender.renderSteps(result.direction, this.mapData);
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
