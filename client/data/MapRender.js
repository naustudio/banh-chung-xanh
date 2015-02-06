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

		checkIE: function() {
			var ua = window.navigator.userAgent;
			var myNav = navigator.userAgent.toLowerCase();
			var checkIE = false;
			var msie = ua.indexOf('MSIE');

			var versionIE = parseInt(myNav.split('msie')[1]);

			if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer, return version number
			{
				checkIE = versionIE;
			}

			return checkIE;
		},

		transformHTML: function(position, className) {
			if (position && className) {
				return '<div style="-webkit-transform:translate(' + position.x * 100 + '%, ' + position.y * 100 + '%); -moz-transform:translate(' + position.x * 100 + '%, ' + position.y * 100 + '%); -ms-transform:translate(' + position.x * 100 + '%, ' + position.y * 100 + '%); -o-transform:translate(' + position.x * 100 + '%, ' + position.y * 100 + '%); transform:translate(' + position.x * 100 + '%, ' + position.y * 100 + '%);" data-x="' + position.x + '" data-y="' + position.y + '" class="square ' + className + '"></div>';
			} else {
				return '';
			}
		},
		renderStatic: function(mapDataObj) {
			var mapData = mapDataObj.getStaticObjData();
			var diskPositions = mapDataObj.getDiskList();
			var staticHTML = '';

			var squareIE = 'n';

			if (this.checkIE()) {
				squareIE = 'square-ie';
			}

			//alert(this.checkIE());


			this.mapGenerated = new Grid().reMap(mapData);
			for (var y = 0; y < this.mapGenerated.length; y++) {
				for (var x = 0; x < this.mapGenerated[y].length; x++) {
					staticHTML += '<div data-x="' + x + '" data-y="' + y + '" class="square ' + squareIE + ' ' + this.mapGenerated[y][x].shapeClass() + '"></div>';
				}
			}

			if (this.checkIE()) {
				if (this.checkIE()===8 || this.checkIE() ===9) {
					for (var i = 0; i < diskPositions.length; i++) {
						staticHTML += '<div style="left:' + ( diskPositions[i].x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( diskPositions[i].y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + x + '" data-y="' + y + '" class="square goal"></div>';
					}

				}
			}
			else {
				for (var i = 0; i < diskPositions.length; i++) {
					staticHTML += this.transformHTML(diskPositions[i],'goal');//'<div style="-webkit-transform:translate(' + diskPositions[i].x * 100 + '%, ' + diskPositions[i].y * 100 + '%);-ms-transform:translate(' + diskPositions[i].x * 100 + '%, ' + diskPositions[i].y * 100 + '%);transform:translate(' + diskPositions[i].x * 100 + '%, ' + diskPositions[i].y * 100 + '%);" data-x="' + diskPositions[i].x + '" data-y="' + diskPositions[i].y + '" class="square goal"></div>';
				}
			}


			var dynamicHTML = this.renderDynamic(window.chungapp.data.MapData.DIRECTION_DEFAULT, mapDataObj, squareIE);
			staticHTML += dynamicHTML;
			// TODO : Render HTML to append to grid the user, disks and chung
			return staticHTML;
		},
		renderDynamic: function(direction, mapDataObj, squareIE) {
			var dynamicHTML = '';

			var userPosition = mapDataObj.getUserPosition();
			var chungPositions = mapDataObj.getChungList();

			var IE = this.checkIE();
			if (IE) {
				if (IE===8) {

					dynamicHTML += '<div style="left:' + ( userPosition.x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( userPosition.y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + userPosition.x + '" data-y="' + userPosition.y + '" class="square user user-' + direction + '  ' + squareIE  + '"></div>';
					for (var i = 0; i < chungPositions.length; i++) {
						dynamicHTML += '<div style="left:' + ( chungPositions[i].x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( chungPositions[i].y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + chungPositions[i].x + '" data-y="' + chungPositions[i].y + '" class="square banh-chung"></div>';
					}
				}
			}
			else {
				dynamicHTML += this.transformHTML(userPosition, squareIE + ' user user-' + direction);//'<div style="-webkit-transform:translate(' + userPosition.x * 100 + '%, ' + userPosition.y * 100 + '%);-ms-transform:translate(' + userPosition.x * 100 + '%, ' + userPosition.y * 100 + '%);transform:translate(' + userPosition.x * 100 + '%, ' + userPosition.y * 100 + '%);" data-x="' + userPosition.x + '" data-y="' + userPosition.y + '" class="square user user-' + direction + '"></div>';
				for (var i = 0; i < chungPositions.length; i++) {
					dynamicHTML += this.transformHTML(chungPositions[i], 'banh-chung');//'<div style="-webkit-transform:translate(' + chungPositions[i].x * 100 + '%, ' + chungPositions[i].y * 100 + '%);-ms-transform:translate(' + chungPositions[i].x * 100 + '%, ' + chungPositions[i].y * 100 + '%);transform:translate(' + chungPositions[i].x * 100 + '%, ' + chungPositions[i].y * 100 + '%);" data-x="' + chungPositions[i].x + '" data-y="' + chungPositions[i].y + '" class="square banh-chung"></div>';
				}
			}

			return dynamicHTML;


			/*
			var dynamicHTML = '';

			var userPosition = mapDataObj.getUserPosition();
			var chungPositions = mapDataObj.getChungList();

			dynamicHTML += '<div style="left:' + ( userPosition.x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( userPosition.y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + userPosition.x + '" data-y="' + userPosition.y + '" class="square user user-' + direction + '"></div>';
			for (var i = 0; i < chungPositions.length; i++) {
				dynamicHTML += '<div style="left:' + ( chungPositions[i].x / mapDataObj.getMapWidth() ) * 100 + '%; top: ' + ( chungPositions[i].y / mapDataObj.getMapHeight() ) * 100 + '%;" data-x="' + chungPositions[i].x + '" data-y="' + chungPositions[i].y + '" class="square banh-chung"></div>';
			}
			return dynamicHTML;
			 */
		},
		renderSteps: function(direction, mapData) {
			var userPosition = mapData.getUserPosition();
			var chungPositions = mapData.getChungList();
			var diskPositions = mapData.getDiskList();

			console.log('==renderSteps');
			console.log(direction, userPosition, chungPositions);

			var dataX = userPosition.x;
			var dataY = userPosition.y;
			var directionClass = 'user-' + direction;

			var IE = this.checkIE();


			if (IE) {
				if (IE===8) {
					$('.user').removeClass('user-right user-left user-up user-down')
						.addClass(directionClass)
						.css({
							'left': ( dataX / 12 ) * 100 + '%',
							'top': ( dataY / 12 ) * 100 + '%'
						});
				}
			}
			else {
				$('.user')
					.removeClass('user-right user-left user-up user-down')
					.addClass(directionClass)
					.css({
						'-webkit-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
						'-moz-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
						'-o-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
						'-ms-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
						'transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)'
					});
			}


			var banhChungArray = $('.banh-chung');

			if (banhChungArray) {
				for (var i = 0; i < banhChungArray.length; i++) {
					dataX = chungPositions[i].x;
					dataY = chungPositions[i].y;

					if (IE) {
						if (IE===8) {
							$(banhChungArray[i]).css({
								'left': ( dataX / 12 ) * 100 + '%',
								'top': ( dataY / 12 ) * 100 + '%'
							});
						}
					}
					else {
						$(banhChungArray[i]).css({
							'-webkit-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
							'-moz-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
							'-o-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
							'-ms-transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)',
							'transform':'translate(' + dataX  * 100 + '%'+ ',' + dataY  * 100 + '%)'
						});
					}
				}

			}

			// check position of banh chung and disk
			for (var j = 0; j < chungPositions.length; j++) {

				$(banhChungArray[j]).removeClass('highlight');

				//banhChungArray[j].classList.remove('highlight');

				for (var d = 0; d < diskPositions.length; d++) {
					if (chungPositions[j].x === diskPositions[d].x && chungPositions[j].y === diskPositions[d].y) {
						// highlight this banh chung
						//banhChungArray[j].classList.add('highlight');
						$(banhChungArray[j]).addClass('highlight');
					}
				}
			}
		},

		renderMapFromDoms: function() {

		}
	};

	render.MapRender = MapRender;

}(window.chungapp.render));
