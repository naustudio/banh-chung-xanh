
/* © 2014 nau.com
 * @author Phuong Vo
 * This class is represented for Map obj
 * It contain:
 * 		1/ the map data and
 * It provide
 * 		1/some methods to check whether we can go left, right, up or down
 * 		2/Methods to move left, right, up or down
 * 		3/Method to check whether user win or not
 * 		4/The history of user moving
 * 		5/The solution for each map
 *
 */
window.chungapp = window.chungapp || {};
window.chungapp.data = window.chungapp.data || {};

(function(data) {
	'use strict';

	//Map object
	function Map() {

	}

	//define method, property here
	Map.prototype = {
		constructor: Map,

		mapData : null,		//mapData is MapData class

		mapRectangleData : null,	//map data, it is an array that each element is an array
		userPosition: null,		//user positon
		chungItems: null,		//list chung that need to be moved to correct disk
		diskItems: null,			//list item

		histories: null,			//the user history, user history structure:
								//	{
								//		direction : MapData.DIRECTION_UP,
								//		action: MapData.ACTION_MOVING,
								//		userPosition: Position
								//		chungPosition: [
								//			Position,
								//			Position,
								//			Position
								//		]
								//	}
		solutions: null,			//it is array of MapData.DIRECTION_UP, MapData.DIRECTION_DOWN, MapData.DIRECTION_LEFT
								//MapData.DIRECTION_RIGHT


		//private
		_initData: function(mapData) {
			this.mapData =mapData;

			this.mapRectangleData = this.mapData.getStaticObjData();

			this.userPosition = this.mapData.getUserPosition();
			this.chungItems = this.mapData.getChungList();
			this.diskItems = this.mapData.getDiskList();

			this.histories = [];
			this.solutions = [];
		},

		//getter/setter
		getUserPosition: function() {
			return this.userPosition;
		},

		_setUserPosition: function(x, y) {
			this.userPosition.setData(x, y);
		},

		_getMapWidth: function() {
			return this.mapRectangleData[0].length;
		},

		_getMapHeight: function() {
			return this.mapRectangleData.length;
		},

		_getChungAtPosition: function(position) {
			for (var i = 0; i < this.chungItems.length; i++) {
				var chungObj = this.chungItems[i];
				if (chungObj.equalWithPosition(position)) {
					return chungObj;
				}
			}

			return null;
		},

		//validate move or push
		_validateMove: function(nextPosition) {
			var isSpaceAtNextPosition = nextPosition && this.mapRectangleData[nextPosition.y][nextPosition.x] === window.chungapp.data.MapData.SPACE_OBJ;

			return isSpaceAtNextPosition;
		},

		_validatePush: function(nextPosition, nextOfNextPosition) {
			var isNextOfNextAvailable = nextOfNextPosition && this.mapRectangleData[nextOfNextPosition.y][nextOfNextPosition.x] === window.chungapp.data.MapData.SPACE_OBJ;
			var isChungAtNextPosition = nextPosition && this.mapRectangleData[nextPosition.y][nextPosition.x] === window.chungapp.data.MapData.CHUNG_OBJ;

			return isNextOfNextAvailable && isChungAtNextPosition;
		},

		_validate: function(nextPosition, nextOfNextPosition) {
			return this._validateMove(nextPosition) || this._validatePush(nextPosition, nextOfNextPosition);
		},

		//get position by action(up/down/left/right)
		//return null => can not find the postion by direction
		_getPostionByAction: function(position, direction) {
			var xPos = position.x;
			var yPos = position.y;
			switch (direction) {
				case window.chungapp.data.MapData.DIRECTION_UP:
					if (yPos > 0) {
						return new window.chungapp.data.MapData.Position(xPos, yPos - 1);
					}
					break;
				case window.chungapp.data.MapData.DIRECTION_DOWN:
					if (yPos < this._getMapHeight() - 2) {
						return new window.chungapp.data.MapData.Position(xPos, yPos + 1);
					}
					break;
				case window.chungapp.data.MapData.DIRECTION_LEFT:
					if (xPos > 0) {
						return new window.chungapp.data.MapData.Position(xPos - 1, yPos);
					}
					break;
				case window.chungapp.data.MapData.DIRECTION_RIGHT:
					if (xPos < this._getMapWidth() - 2) {
						return new window.chungapp.data.MapData.Position(xPos + 1, yPos);
					}
					break;
			}

			return null;	//default is null
		},

		//public data
		getMapData: function() {
			return this.mapRectangleData;
		},

		getChungList: function() {
			return this.chungItems;
		},

		getDiskList: function() {
			return this.diskItems;
		},

		//public method - moving, check win, check moving
		goUp: function() {
			var resultAction = window.chungapp.data.MapData.ACTION_NOTHING;

			if (this.canGoUp()) {
				//if can go up => do action : move user or move chung
				var upPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_UP);
				var isSpaceAtUpPosition = upPosition && this.mapRectangleData[upPosition.y][upPosition.x] === window.chungapp.data.MapData.SPACE_OBJ;
				if (isSpaceAtUpPosition) {
					//only move user
					this._setUserPosition(upPosition.x, upPosition.y);

					resultAction = window.chungapp.data.MapData.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(upPosition.x, upPosition.y);
					var chungObj = this._getChungAtPosition(upPosition);
					var upUpPosition = this._getPostionByAction(upPosition, window.chungapp.data.MapData.DIRECTION_UP);
					if (chungObj && upUpPosition) {
						chungObj.setData(upUpPosition.x, upUpPosition.y);

						resultAction = window.chungapp.data.MapData.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== window.chungapp.data.MapData.ACTION_NOTHING) {
				//add to history
				this._addToHistory(window.chungapp.data.MapData.DIRECTION_UP, resultAction);
			}

			return window.chungapp.data.MapData.ACTION_NOTHING;
		},

		canGoUp: function() {
			var upPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_UP);
			var upUpPosition = upPosition ? this._getPostionByAction(upPosition, window.chungapp.data.MapData.DIRECTION_UP)  : null;
			return this._validate(upPosition, upUpPosition);
		},

		goDown: function() {
			var resultAction = window.chungapp.data.MapData.ACTION_NOTHING;

			if (this.canGoDown()) {
				//if can go down => do action : move user or move chung
				var downPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_UP);
				var isSpaceAtDownPosition = downPosition && this.mapRectangleData[downPosition.y][downPosition.x] === window.chungapp.data.MapData.SPACE_OBJ;
				if (isSpaceAtDownPosition) {
					//only move user
					this._setUserPosition(downPosition.x, downPosition.y);

					resultAction = window.chungapp.data.MapData.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(downPosition.x, downPosition.y);
					var chungObj = this._getChungAtPosition(downPosition);
					var downDownPosition = this._getPostionByAction(downPosition, window.chungapp.data.MapData.DIRECTION_UP);
					if (chungObj && downDownPosition) {
						chungObj.setData(downDownPosition.x, downDownPosition.y);

						resultAction = window.chungapp.data.MapData.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== window.chungapp.data.MapData.ACTION_NOTHING) {
				//add to history
				this._addToHistory(window.chungapp.data.MapData.DIRECTION_DOWN, resultAction);
			}

			return window.chungapp.data.MapData.ACTION_NOTHING;
		},

		canGoDown: function() {
			var downPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_DOWN);
			var downDownPosition = downPosition ? this._getPostionByAction(downPosition, window.chungapp.data.MapData.DIRECTION_DOWN)  : null;
			return this._validate(downPosition, downDownPosition);
		},

		goLeft: function() {
			var resultAction = window.chungapp.data.MapData.ACTION_NOTHING;

			if (this.canGoLeft()) {
				//if can go down => do action : move user or move chung
				var leftPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_LEFT);
				var isSpaceALeftPosition = leftPosition && this.mapRectangleData[leftPosition.y][leftPosition.x] === window.chungapp.data.MapData.SPACE_OBJ;
				if (isSpaceALeftPosition) {
					//only move user
					this._setUserPosition(leftPosition.x, leftPosition.y);

					resultAction = window.chungapp.data.MapData.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(leftPosition.x, leftPosition.y);
					var chungObj = this._getChungAtPosition(leftPosition);
					var leftLeftPosition = this._getPostionByAction(leftPosition, window.chungapp.data.MapData.DIRECTION_LEFT);
					if (chungObj && leftLeftPosition) {
						chungObj.setData(leftLeftPosition.x, leftLeftPosition.y);

						resultAction = window.chungapp.data.MapData.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== window.chungapp.data.MapData.ACTION_NOTHING) {
				//add to history
				this._addToHistory(window.chungapp.data.MapData.DIRECTION_LEFT, resultAction);
			}

			return window.chungapp.data.MapData.ACTION_NOTHING;
		},

		canGoLeft: function() {
			var leftPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_LEFT);
			var leftLeftPosition = leftPosition ? this._getPostionByAction(leftPosition, window.chungapp.data.MapData.DIRECTION_LEFT)  : null;
			return this._validate(leftPosition, leftLeftPosition);
		},

		goRight: function() {
			var resultAction = window.chungapp.data.MapData.ACTION_NOTHING;

			if (this.canGoRight()) {
				//if can go down => do action : move user or move chung
				var rightPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_RIGHT);
				var isSpaceARightPosition = rightPosition && this.mapRectangleData[rightPosition.y][rightPosition.x] === window.chungapp.data.MapData.SPACE_OBJ;
				if (isSpaceARightPosition) {
					//only move user
					this._setUserPosition(rightPosition.x, rightPosition.y);

					resultAction = window.chungapp.data.MapData.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(rightPosition.x, rightPosition.y);
					var chungObj = this._getChungAtPosition(rightPosition);
					var rightRightPosition = this._getPostionByAction(rightPosition, window.chungapp.data.MapData.DIRECTION_RIGHT);
					if (chungObj && rightRightPosition) {
						chungObj.setData(rightRightPosition.x, rightRightPosition.y);

						resultAction = window.chungapp.data.MapData.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== window.chungapp.data.MapData.ACTION_NOTHING) {
				//add to history
				this._addToHistory(window.chungapp.data.MapData.DIRECTION_RIGHT, resultAction);
			}

			return window.chungapp.data.MapData.ACTION_NOTHING;
		},

		canGoRight: function() {
			var leftPosition = this._getPostionByAction(this.getUserPosition(), window.chungapp.data.MapData.DIRECTION_RIGHT);
			var leftLeftPosition = leftPosition ? this._getPostionByAction(leftPosition, window.chungapp.data.MapData.DIRECTION_RIGHT)  : null;
			return this._validate(leftPosition, leftLeftPosition);
		},

		isWin: function() {
			var numMatched = 0;
			var numChungMustBeMatched = this.diskItems.length;
			for (var i = 0; i < this.chungItems.length; i++) {
				var chungObj = this.chungItems[i];
				for (var j = 0; j < this.diskItems.length; j++) {
					var diskObj = this.diskItems[j];
					if (chungObj.equalWithPosition(diskObj)) {
						numMatched ++;
						break;
					}
				}
			}

			return numMatched === numChungMustBeMatched;
		},

		//for user history
		_createTheHistoryData: function(direction, action) {
			var chungPosition = [];
			for (var i = 0; i < this.chungItems.length; i++) {
				chungPosition.push(this.chungItems[i].clone());
			}

			return {
				'direction': direction,
				'action' : action,
				'userPosition' : this.getUserPosition().clone(),
				'chungPosition' : chungPosition
			};
		},

		_addToHistory: function(direction, action) {
			var historyItem = this._createTheHistoryData(direction, action);
			this.histories.push(historyItem);
		},

		canUndo: function() {
			return this.histories.length > 0;
		},

		//undo return action/ direction
		undo: function() {
			if (this.canUndo()) {
				var historyItem = this.histories.pop();

				//restore the userPosition and disklist position
				var userPos = historyItem.userPosition;
				this._setUserPosition(userPos.x, userPos.y);

				//restore diskItems list
				this.chungItems = historyItem.chungPosition;

				return {
					'action' : historyItem.action,
					'direction' : historyItem.direction
				};
			}

			return {
				'action' : window.chungapp.data.MapData.ACTION_NOTHING,
				'direction' : null
			};
		},

		getHistoryNum : function() {
			return this.histories.length;
		},

		//solve solution
		solveMap : function() {

		},

		setMapData: function(mapData) {
			this._initData(mapData);
		}

	};

	// exports
	data.Map = Map;
}(window.chungapp.data));