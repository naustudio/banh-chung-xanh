/* © 2014 nau.com
 * @author Phuong Vo
 *
 */
/*global chungapp:true, data:true, render:true*/
chungapp = chungapp || {};
data = chungapp.data || {};
render = chungapp.render || {};

(function(chungapp) {
	'use strict';

	function Game(map) {
		this.initData(map);
	}

	//define method, property here
	Game.prototype = {
		constructor: Game,

		mapData: null,
		mapRender: null,
		mapRenderedHTML: null,

		initData: function(map) {
			this.mapData = new chungapp.data.Map(map);
			this.mapRender = new chungapp.render.MapRender();
			if (map) {
				this.mapRenderedHTML = this.mapRender.renderStatic(this.mapData.getMapData(),
					this.mapData.getUserPosition(), this.mapData.getChungList(), this.mapData.getDiskList());
			}
		},

		setMapData: function(map) {
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
			}
		}
	};

	chungapp.Game = Game;
}(chungapp));