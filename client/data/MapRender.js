/* © 2014 nau.com
 * @author Phuong Vo
 *
 */

window.chungapp = window.chungapp || {};
window.chungapp.render = window.chungapp.render || {};

(function(render) {
	'use strict';

	//constant-static for class here
	Square.OBJECT_CONFIG = {
		'-2': 'space',
		'-1': 'wall',
		'0' : 'user',
		'1' : 'chung',
		'2' : 'disk',
		'3' : 'tree',
		'4' : 'rock'
	};

	function Square(x, y, shape) {
		if (x !== undefined && y !== undefined && shape !== undefined) {
			this.x = x;
			this.y = y;
			if ( shape !== 1 && shape !== 0 ) {
				this.shape = shape;
			} else {
				this.shape = -2;
			}
		} else {
			this.x = -1;
			this.y = -1;
			this.shape = -2;
		}
	}
	Square.prototype = {
		constructor : Square,
		shapeClass: function() {
			return Square.OBJECT_CONFIG[this.shape.toString()];
		}
	};

	function Grid(){
		this.mapView = [];
	}
	Grid.prototype = {
		constructor : Grid,
		reMap : function(map) {
			var mapData = map;
			var mapGenerated = [];
			for (var y = 0; y < mapData.length; y++) {
				mapGenerated[y] = [];
				for (var x = 0; x < mapData[y].length; x++) {
					mapGenerated[y][x] = new Square( x , y , mapData[y][x]);
					//console.log(this.mapData[y][x]);
				}
			}
			this.mapView = mapGenerated;
			//console.log(mapGenerated);
			return mapGenerated;
		}
	};

	function MapRender() {
		this.mapGenerated = [];
	}

	//define method, property here
	MapRender.prototype = {
		constructor: MapRender,
		renderStatic: function(mapData, userPostion, chungPosition, diskPosition) {
			var staticHTML = '';
			this.mapGenerated = new Grid().reMap(mapData);
			for (var y = 0; y < this.mapGenerated.length; y++) {
				for (var x = 0; x < this.mapGenerated[y].length; x++) {
					staticHTML += '<div data-x="' + x + '" data-y="' + y + '" class="square '+ this.mapGenerated[y][x].shapeClass() + '"></div>';
				}
			}
			return staticHTML;
		},
		renderSteps: function(direction, userPosition, chungPositions) {
			console.log("==renderSteps");
		}
	};

	render.MapRender = MapRender;

}(window.chungapp.render));