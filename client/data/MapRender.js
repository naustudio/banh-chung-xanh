/* © 2014 nau.com
 * @author Phuong Vo
 *
 */

window.chungapp = window.chungapp || {};
window.chungapp.render = window.chungapp.render || {};

(function(render) {
	'use strict';

	function MapRender() {

	}

	//define method, property here
	MapRender.prototype = {
		constructor: MapRender,

		render: function(mapData) {
			console.log('==mapData' + mapData);
		}
	};

	render.MapRender = MapRender;

}(window.chungapp.render));