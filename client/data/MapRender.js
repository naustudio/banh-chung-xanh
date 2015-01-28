/* © 2014 nau.com
 * @author Phuong Vo
 *
 */

window.chungapp = window.chungapp || {};
window.chungapp.render = window.chungapp.render || {};

(function(render) {
	'use strict';

	function Square(x, y, shape) {
		if (x !== undefined && y !== undefined && shape !== undefined) {
			this.x = x;
			this.y = y;
			if ( shape !== window.chungapp.data.MapData.CHUNG_OBJ && shape !== window.chungapp.data.MapData.USER_OBJ ) {
				this.shape = shape;
			} else if ( shape === window.chungapp.data.MapData.CHUNG_OBJ || shape === window.chungapp.data.MapData.USER_OBJ || shape === window.chungapp.data.MapData.DISK_OBJ) {
				this.shape = window.chungapp.data.MapData.GROUND_OBJ;
			} else {
				this.shape = window.chungapp.data.MapData.SPACE_OBJ;
			}
		} else {
			this.x = -1;
			this.y = -1;
			this.shape = window.chungapp.data.MapData.SPACE_OBJ;
		}
	}
	Square.prototype = {
		constructor : Square,
		shapeClass: function() {
			return window.chungapp.data.MapData.OBJECT_CONFIG[this.shape.toString()];
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
		renderStatic: function(mapDataObj) {
			var mapData = mapDataObj.getStaticObjData();
			var userPosition = mapDataObj.getUserPosition();
			var chungPositions = mapDataObj.getChungList();
			var diskPositions = mapDataObj.getDiskList();
			var staticHTML = '';

			this.mapGenerated = new Grid().reMap(mapData);
			for (var y = 0; y < this.mapGenerated.length; y++) {
				for (var x = 0; x < this.mapGenerated[y].length; x++) {
					staticHTML += '<div data-x="' + x + '" data-y="' + y + '" class="square '+ this.mapGenerated[y][x].shapeClass() + '"></div>';
				}
			}
			for (var i = 0; i < diskPositions.length; i++) {
				staticHTML += '<div style="left:' + ( diskPositions[i].x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( diskPositions[i].y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + x + '" data-y="' + y + '" class="square goal"></div>';
			}
			var dynamicHTML = this.renderDynamic(window.chungapp.data.MapData.DIRECTION_DEFAULT, mapDataObj);
			staticHTML += dynamicHTML;
			// TODO : Render HTML to append to grid the user, disks and chung
			return staticHTML;
		},
		renderDynamic: function(direction, mapDataObj) {
			var dynamicHTML = '';

			var userPosition = mapDataObj.getUserPosition();
			var chungPositions = mapDataObj.getChungList();

			dynamicHTML += '<div style="left:' + ( userPosition.x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( userPosition.y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + userPosition.x + '" data-y="' + userPosition.y + '" class="square user user-' + direction + '"></div>';
			for (var i = 0; i < chungPositions.length; i++) {
				dynamicHTML += '<div style="left:' + ( chungPositions[i].x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( chungPositions[i].y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + chungPositions[i].x + '" data-y="' + chungPositions[i].y + '" class="square banh-chung"></div>';
			}
			return dynamicHTML;
		},
		renderSteps: function(direction, mapData) {
			var userPosition = mapData.getUserPosition();
			var chungPositions = mapData.getChungList();

			console.log('==renderSteps');
			console.log(direction, userPosition, chungPositions);

			var dataX = userPosition.x;
			var dataY = userPosition.y;

			$('.user').addClass('moving').css({
				'left': ( dataX / 12 ) * 100 + '%',
				'top': ( dataY / 12 ) * 100 + '%'
			});

			var banhChungArray = $('.banh-chung');

			if (banhChungArray) {
				for (var i = 0; i < banhChungArray.length; i++) {
					dataX = chungPositions[i].x;
					dataY = chungPositions[i].y;

					$(banhChungArray[i]).css({
						'left': ( dataX / 12 ) * 100 + '%',
						'top': ( dataY / 12 ) * 100 + '%'
					});
				}

			}
			var el = document.getElementsByClassName('user')[0];
			el.addEventListener("transitionend", function() {
				$(this).removeClass('moving');
			}, true);

		},

		renderMapFromDoms: function() {

		}
	};

	render.MapRender = MapRender;

}(window.chungapp.render));
