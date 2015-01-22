
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
/*global chungapp:true, data:true*/
window.chungapp = window.chungapp || {};
window.chungapp.data = window.chungapp.data || {};

(function(data) {
	'use strict';

	//Position object
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


	//Map object
	function Map(mapData) {
		var testMapData = [
				[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
				[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
				[-2,-2,-2,-1,-1,-1,-1,-2,-2,-2,-2,-2],
				[-2,-2,-2,-1,-2,-2,-1,-2,-2,-2,-2,-2],
				[-2,-2,-2,-1,-2, 0,-1,-2,-2,-2,-2,-2],
				[-2,-2,-1,-1, 2,-2,-1,-1,-1,-1,-2,-2],
				[-2,-2,-1,-2, 1, 1, 2,-2, 2,-1,-2,-2],
				[-2,-2,-1,-2,-2, 1,-2,-1,-1,-1,-2,-2],
				[-2,-2,-1,-1,-1,-2,-2,-1,-2,-2,-2,-2],
				[-2,-2,-2,-2,-1,-1,-1,-1,-2,-2,-2,-2],
				[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
				[-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2]
			];
		var targetMap =mapData || testMapData;
		this._initData(targetMap);
	}

	//all object in map
	Map.SPACE_OBJ = -2;
	Map.WALL_OBJ = -1;
	Map.USER_OBJ = 0;
	Map.CHUNG_OBJ = 1;
	Map.DISK_OBJ = 2;

	//direction
	Map.DIRECTION_UP = 'up';
	Map.DIRECTION_DOWN = 'down';
	Map.DIRECTION_LEFT = 'left';
	Map.DIRECTION_RIGHT = 'right';

	//type moving
	Map.ACTION_NOTHING = 'action_nothing';
	Map.ACTION_MOVING = 'action_moving';
	Map.ACTION_PUSHING_CHUNG = 'action_pushing_chung';


	//constant-static for class here
	Map.OBJECT_CONFIG = {
		'-2': 'space',
		'-1': 'wall',
		'0' : 'user',
		'1' : 'chung',
		'2' : 'disk',
		'3' : 'tree',
		'4' : 'rock'
	};

	//define method, property here
	Map.prototype = {
		constructor: Map,

		mapRectangleData : null,	//map data, it is an array that each element is an array
		userPosition: null,		//user positon
		chungItems: null,		//list chung that need to be moved to correct disk
		diskItems: null,			//list item

		histories: null,			//the user history, user history structure:
								//	{
								//		direction : Map.DIRECTION_UP,
								//		action: ACTION_MOVING,
								//		userPosition: Position
								//		chungPosition: [
								//			Position,
								//			Position,
								//			Position
								//		]
								//	}

		//private
		_initData: function(mapData) {
			this.mapRectangleData = mapData;

			this.userPosition = new Position();

			this.chungItems = [];
			this.diskItems = [];

			this.histories = [];

			//create objects from maps
			this._initAllObject();
		},

		_initAllObject: function() {
			for (var y = 0; y < this.mapRectangleData.length; y++) {
				for (var x = 0; x < this.mapRectangleData[y].length; x++) {
					if (this.mapRectangleData[y][x] === Map.USER_OBJ) {
						this.userPosition.setData(x, y);
						//reset the data in map
						this.mapRectangleData[y][x] = Map.SPACE_OBJ;
					}else if (this.mapRectangleData[y][x] === Map.CHUNG_OBJ) {
						this.chungItems.push(new Position(x, y));
						//reset the data in map
						this.mapRectangleData[y][x] = Map.SPACE_OBJ;
					} else if (this.mapRectangleData[y][x] === Map.DISK_OBJ) {
						this.diskItems.push(new Position(x, y));
						//reset the data in map
						this.mapRectangleData[y][x] = Map.SPACE_OBJ;
					}
				}
			}
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
			var isSpaceAtNextPosition = nextPosition && this.mapRectangleData[nextPosition.y][nextPosition.x] === Map.SPACE_OBJ;

			return isSpaceAtNextPosition;
		},

		_validatePush: function(nextPosition, nextOfNextPosition) {
			var isNextOfNextAvailable = nextOfNextPosition && this.mapRectangleData[nextOfNextPosition.y][nextOfNextPosition.x] === Map.SPACE_OBJ;
			var isChungAtNextPosition = nextPosition && this.mapRectangleData[nextPosition.y][nextPosition.x] === Map.CHUNG_OBJ;

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
				case Map.DIRECTION_UP:
					if (yPos > 0) {
						return new Position(xPos, yPos - 1);
					}
					break;
				case Map.DIRECTION_DOWN:
					if (yPos < this._getMapHeight() - 2) {
						return new Position(xPos, yPos + 1);
					}
					break;
				case Map.DIRECTION_LEFT:
					if (xPos > 0) {
						return new Position(xPos - 1, yPos);
					}
					break;
				case Map.DIRECTION_RIGHT:
					if (xPos < this._getMapWidth() - 2) {
						return new Position(xPos + 1, yPos);
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
			var resultAction = Map.ACTION_NOTHING;

			if (this.canGoUp()) {
				//if can go up => do action : move user or move chung
				var upPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_UP);
				var isSpaceAtUpPosition = upPosition && this.mapRectangleData[upPosition.y][upPosition.x] === Map.SPACE_OBJ;
				if (isSpaceAtUpPosition) {
					//only move user
					this._setUserPosition(upPosition.x, upPosition.y);

					resultAction = Map.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(upPosition.x, upPosition.y);
					var chungObj = this._getChungAtPosition(upPosition);
					var upUpPosition = this._getPostionByAction(upPosition, Map.DIRECTION_UP);
					if (chungObj && upUpPosition) {
						chungObj.setData(upUpPosition.x, upUpPosition.y);

						resultAction = Map.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== Map.ACTION_NOTHING) {
				//add to history
				this._addToHistory(Map.DIRECTION_UP, resultAction);
			}

			return Map.ACTION_NOTHING;
		},

		canGoUp: function() {
			var upPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_UP);
			var upUpPosition = upPosition ? this._getPostionByAction(upPosition, Map.DIRECTION_UP)  : null;
			return this._validate(upPosition, upUpPosition);
		},

		goDown: function() {
			var resultAction = Map.ACTION_NOTHING;

			if (this.canGoDown()) {
				//if can go down => do action : move user or move chung
				var downPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_DOWN);
				var isSpaceAtDownPosition = downPosition && this.mapRectangleData[downPosition.y][downPosition.x] === Map.SPACE_OBJ;
				if (isSpaceAtDownPosition) {
					//only move user
					this._setUserPosition(downPosition.x, downPosition.y);

					resultAction = Map.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(downPosition.x, downPosition.y);
					var chungObj = this._getChungAtPosition(downPosition);
					var downDownPosition = this._getPostionByAction(downPosition, Map.DIRECTION_DOWN);
					if (chungObj && downDownPosition) {
						chungObj.setData(downDownPosition.x, downDownPosition.y);

						resultAction = Map.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== Map.ACTION_NOTHING) {
				//add to history
				this._addToHistory(Map.DIRECTION_DOWN, resultAction);
			}

			return Map.ACTION_NOTHING;
		},

		canGoDown: function() {
			var downPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_DOWN);
			var downDownPosition = downPosition ? this._getPostionByAction(downPosition, Map.DIRECTION_DOWN)  : null;
			return this._validate(downPosition, downDownPosition);
		},

		goLeft: function() {
			var resultAction = Map.ACTION_NOTHING;

			if (this.canGoLeft()) {
				//if can go down => do action : move user or move chung
				var leftPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_LEFT);
				var isSpaceALeftPosition = leftPosition && this.mapRectangleData[leftPosition.y][leftPosition.x] === Map.SPACE_OBJ;
				if (isSpaceALeftPosition) {
					//only move user
					this._setUserPosition(leftPosition.x, leftPosition.y);

					resultAction = Map.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(leftPosition.x, leftPosition.y);
					var chungObj = this._getChungAtPosition(leftPosition);
					var leftLeftPosition = this._getPostionByAction(leftPosition, Map.DIRECTION_LEFT);
					if (chungObj && leftLeftPosition) {
						chungObj.setData(leftLeftPosition.x, leftLeftPosition.y);

						resultAction = Map.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== Map.ACTION_NOTHING) {
				//add to history
				this._addToHistory(Map.DIRECTION_LEFT, resultAction);
			}

			return Map.ACTION_NOTHING;
		},

		canGoLeft: function() {
			var leftPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_LEFT);
			var leftLeftPosition = leftPosition ? this._getPostionByAction(leftPosition, Map.DIRECTION_LEFT)  : null;
			return this._validate(leftPosition, leftLeftPosition);
		},

		goRight: function() {
			var resultAction = Map.ACTION_NOTHING;

			if (this.canGoRight()) {
				//if can go down => do action : move user or move chung
				var rightPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_RIGHT);
				var isSpaceARightPosition = rightPosition && this.mapRectangleData[rightPosition.y][rightPosition.x] === Map.SPACE_OBJ;
				if (isSpaceARightPosition) {
					//only move user
					this._setUserPosition(rightPosition.x, rightPosition.y);

					resultAction = Map.ACTION_MOVING;
				} else {
					//move the chung and move user
					this._setUserPosition(rightPosition.x, rightPosition.y);
					var chungObj = this._getChungAtPosition(rightPosition);
					var rightRightPosition = this._getPostionByAction(rightPosition, Map.DIRECTION_RIGHT);
					if (chungObj && rightRightPosition) {
						chungObj.setData(rightRightPosition.x, rightRightPosition.y);

						resultAction = Map.ACTION_PUSHING_CHUNG;
					} else {
						console.log('===can goUp && up position is not space but can not find the Chung ==> check again the logic');
					}
				}
			}

			if (resultAction !== Map.ACTION_NOTHING) {
				//add to history
				this._addToHistory(Map.DIRECTION_RIGHT, resultAction);
			}

			return Map.ACTION_NOTHING;
		},

		canGoRight: function() {
			var leftPosition = this._getPostionByAction(this.getUserPosition(), Map.DIRECTION_RIGHT);
			var leftLeftPosition = leftPosition ? this._getPostionByAction(leftPosition, Map.DIRECTION_RIGHT)  : null;
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
				'action' : Map.ACTION_NOTHING,
				'direction' : null
			};
		},

		getHistoryNum : function() {
			return this.historyItem.length();
		},

		setMapData: function(mapData) {
			this._initData(mapData);
		}

	};

	// exports
	data.Map = Map;
}(window.chungapp.data));