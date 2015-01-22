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
		mapRenderedHTML: null,

		initDefaultValue: function() {
			this.mapData = new chungapp.data.Map();
			this.mapRender = new chungapp.render.MapRender();
			this.mapRenderedHTML = this.mapRender.renderStatic(this.mapData);
		},

		goUp: function() {
			console.log(this.mapData);
			if (this.mapData.canGoUp()) {
				var action = this.mapData.goUp();
				console.log('==action === ' + action);
				if (action === chungapp.data.Map.ACTION_NOTHING) {
					this.mapRender.render(this.mapData);
				}
			}
		}
	};

	chungapp.Game = Game;

	window.game = new Game();
	window.game.goUp();


}(chungapp));