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

	function Game() {
		this.initDefaultValue();
	}

	//define method, property here
	Game.prototype = {
		constructor: Game,

		mapData: null,
		mapRender: null,

		initDefaultValue: function() {
			this.mapData = new chungapp.data.Map();
			this.mapRender = new chungapp.render.MapRender();
			this.mapRender.render(this.mapData);
		},

		setMapData: function(mapData) {
			this.mapData.setMapData(mapData);
			//this.mapRender.render
		},

		//public method
		goUp: function() {
			console.log(this.mapData);
			if (this.mapData.canGoUp()) {
				var action = this.mapData.goUp();
				if (action === chungapp.data.Map.ACTION_NOTHING) {
					this.mapRender.render(this.mapData, action);
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
					this.mapRender.render(this.mapData, action);
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
					this.mapRender.render(this.mapData, action);
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
					this.mapRender.render(this.mapData, action);
				}

				if (this.mapData.isWin()) {
					console.log('==win');
				}
			}
		}
	};

	chungapp.Game = Game;
}(chungapp));