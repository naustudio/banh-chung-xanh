/* © 2014 nau.com
 * @author Phuong Vo
 *
 */

window.chungapp = window.chungapp || {};
window.chungapp.render = window.chungapp.render || {};

(function(render) {
	'use strict';
	function Square(x, y) {
		if (x !== undefined && y !== undefined) {
			this.x = x;
			this.y = y;
		} else {
			this.x = -1;
			this.y = -1;
		}
	}
	Square.prototype = {
		constructor : Square
	}

	function Grid(){
		this.mapView = [];
	}
	Grid.prototype = {
		constructor : Grid,
		reMap : function(map) {
			var mapData = map.mapRectangleData;
			var mapGenerated = [];
			for (var y = 0; y < mapData.length; y++) {
				mapGenerated[y] = [];
				for (var x = 0; x < mapData[y].length; x++) {
					mapGenerated[y][x] = new Square( x , y );
				}
			}
			this.mapView = mapGenerated;
			return mapGenerated;
		}
	}

	function MapRender() {

	}

	//define method, property here
	MapRender.prototype = {
		constructor: MapRender,

		render: function(mapData) {
			window.gridView = new Grid().reMap(mapData);
			console.log('==mapData' + mapData);
		}
	};

	render.MapRender = MapRender;

}(window.chungapp.render));