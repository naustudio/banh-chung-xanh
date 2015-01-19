(function($, doc) {

	/**
	 * [config description]
	 * @type {Object}
	 *  movable : 1 / -1  can move or not
	 *  shape :
	 *    + -2: space,
	 *    + -1: wall,
	 *    + 0 : user,
	 *    + 1 : chung,
	 *    + 2 : disk,
	 *    + 3 : tree,
	 *    + 4 : rock,
	 *
	 */



	var config = {
		'squareWidth':20,
		'vertical': 12,
		'horizol': 12,
		'mapConfig':{
			'-2': 'space',
	 		'-1': 'wall',
	 		'0' : 'user',
	 		'1' : 'chung',
	 		'2' : 'disk',
	 		'3' : 'tree',
	 		'4' : 'rock'
		},
		user : {}
	};
	var mapGenerated = [];
	var map = [
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

	var chung = [];
	var steps = [];
	var chungSteps = [];


	/*var user = {
		'name' : 'Hans',
		'email': 'hans@handsome.com',
		'played': [],
		'lastPlay' : 5
	};*/

	Array.prototype.clone = function() {
		return this.slice(0);
	};
	function htmlChung() {
		var htmlChungContent = '';
		for (var i = 0; i < chung.length; i++) {
			htmlChungContent += chung[i].render();
		}
		return htmlChungContent;
	}
	function renderSteps() {
		var lastStep = steps[steps.length - 1];
		var user = lastStep.user;
		var chungSteps = lastStep.chung;
		var userPosition = $('.square[data-index="' + user + '"]').position();
		var chungCursor = null,
			chungPosition = null;
		$('.pusher').css({
			'top':userPosition.top + 'px',
			'left':userPosition.left + 'px'
		});
		var lastChungStep = chungSteps[ chungSteps.length - 1 ];
		for (var i = 0; i < lastChungStep.length; i++) {
			chungCursor = $('.square[data-index="' + lastChungStep[i].index + '"]');
			if (chungCursor.length > 0) {
				chungPosition = chungCursor.position();
				$('.square[data-chung-move="' + lastChungStep[i].indexChung + '"]').css({
					'top':chungPosition.top + 'px',
					'left':chungPosition.left + 'px'
				});
			}
		}
	}
	function prepareChungSteps() {
		var chungStep = [];
		for (var i = 0; i < chung.length; i++) {
			chungStep[i] = {
				index: chung[i].index,
				indexChung: chung[i].indexChung,
				x: chung[i].mapPosition.x,
				y: chung[i].mapPosition.y
			};
		}
		chungSteps.push(chungStep);
	}
	function Chung(chungInfo) {
		Player.call(this, chungInfo);
		if (chungInfo) {
			this.indexChung = chungInfo.indexChung;
		}
	}
	Chung.prototype.getPosition = function(){
		this.cssPosition.y = $('[data-chung="' + this.indexChung + '"]').position().top;
		this.cssPosition.x = $('[data-chung="' + this.indexChung + '"]').position().left;
	};
	Chung.prototype.render = function() {
		this.getPosition();
		return '<div data-chung-move="' + this.indexChung + '" class="square chungCloned" style="position: absolute; width: ' + config.squareWidth + 'px; height: ' + config.squareWidth + 'px; left:' + this.cssPosition.x + 'px; top:' + this.cssPosition.y + 'px;"></div>';
	};
	function Player(mapPosition) {
		this.cssPosition = {
			x : -1,
			y : -1,
		};
		this.mapPosition = {
			x : mapPosition.x,
			y : mapPosition.y
		};
		this.index = mapPosition.index;
	}
	Player.prototype.getPosition = function() {
		this.cssPosition.y = $('.user').position().top;
		this.cssPosition.x = $('.user').position().left;
	};
	Player.prototype.render = function (){
		this.getPosition();
		return '<div class="square pusher" style="width: ' + config.squareWidth + 'px; height: ' + config.squareWidth + 'px; left:' + this.cssPosition.x + 'px; top:' + this.cssPosition.y + 'px;"></div>';
	};
	Player.prototype.validate = function(currentPosition,nextPosition,nextOfNextPosition) {
		var lastChungStep = chungSteps[chungSteps.length-1].clone();
		if (nextPosition.shape !== '-1' &&
			nextPosition.shape !== '3'  &&
			nextPosition.shape !== '4') {
			if (nextPosition.shape === '1') {
				if (nextOfNextPosition.shape === '-2'){
					this.mapPosition.x = nextPosition.x;
					this.mapPosition.y = nextPosition.y;

					lastChungStep[nextPosition.indexChung - 1].index = nextOfNextPosition.index;
					lastChungStep[nextPosition.indexChung - 1].x = nextOfNextPosition.x;
					lastChungStep[nextPosition.indexChung - 1].y = nextOfNextPosition.y;

					chungSteps.push(lastChungStep);
					steps.push({
						user : nextPosition.index,
						chung : chungSteps.clone()
					});
					renderSteps();
				}
			} else {
				this.mapPosition.x = nextPosition.x;
				this.mapPosition.y = nextPosition.y;
				steps.push({
					user : nextPosition.index,
					chung : chungSteps.clone()
				});
				renderSteps();
			}
		}
	};
	Player.prototype.moveLeft = function() {
		var currentPosition = mapGenerated[this.mapPosition.y][this.mapPosition.x];
		var nextPosition = mapGenerated[currentPosition.y][currentPosition.x - 1];
		var nextOfNextPosition = null;
		if ( ( nextPosition.x - 1 ) >= 0 ){
			nextOfNextPosition = mapGenerated[nextPosition.y][nextPosition.x - 1];
		}
		this.validate(currentPosition,nextPosition,nextOfNextPosition);
	};
	Player.prototype.moveRight = function() {
		var currentPosition = mapGenerated[this.mapPosition.y][this.mapPosition.x];
		var nextPosition = mapGenerated[currentPosition.y][currentPosition.x + 1];
		var nextOfNextPosition = null;
		if ( ( nextPosition.x + 1 ) < map[0].length ){
			nextOfNextPosition = mapGenerated[nextPosition.y][nextPosition.x + 1];
		}
		this.validate(currentPosition,nextPosition,nextOfNextPosition);
	};
	Player.prototype.moveUp = function() {
		var currentPosition = mapGenerated[this.mapPosition.y][this.mapPosition.x];
		var nextPosition = mapGenerated[currentPosition.y - 1][currentPosition.x];
		var nextOfNextPosition = null;
		if ( ( nextPosition.y - 1 ) >= 0 ){
			nextOfNextPosition = mapGenerated[nextPosition.y - 1][nextPosition.x];
		}
		this.validate(currentPosition,nextPosition,nextOfNextPosition);
	};
	Player.prototype.moveDown = function() {
		var currentPosition = mapGenerated[this.mapPosition.y][this.mapPosition.x];
		var nextPosition = mapGenerated[currentPosition.y + 1][currentPosition.x];
		var nextOfNextPosition = null;
		if ( ( nextPosition.y + 1 ) < map.length ){
			nextOfNextPosition = mapGenerated[nextPosition.y + 1][nextPosition.x];
		}
		this.validate(currentPosition,nextPosition,nextOfNextPosition);
	};

	function Square(shapeInfo) {
		this.index = 0;
		this.x = -1;
		this.y = -1;
		this.shape = '-2';
		this.isChung = false;
		this.isUser = false;
		this.indexChung = 0;
		if (shapeInfo) {
			this.index = shapeInfo.index;
			this.x = shapeInfo.x;
			this.y = shapeInfo.y;
			this.shape = shapeInfo.shape;
			this.isChung = shapeInfo.isChung;
			this.isUser = shapeInfo.isUser;
			this.indexChung = shapeInfo.indexChung;
		}
	}
	Square.prototype.shapeClass = function() {
		//console.log(this.shape + '');
		return config.mapConfig[this.shape + ''];
	};

	Square.prototype.render = function() {
		if (this.isChung) {
			return '<div data-index="' + this.index + '" data-chung="' + this.indexChung + '" class="square ' + this.shapeClass() + '" style="width:' + config.squareWidth + 'px; height:' + config.squareWidth + 'px;"></div>';
		} else {
			return '<div data-index="' + this.index + '" class="square ' + this.shapeClass() + '" style="width:' + config.squareWidth + 'px; height:' + config.squareWidth + 'px;"></div>';
		}
	};

	function Grid(map) {
		this.map = map;
		this.layoutData = null;
	}
	Grid.prototype.create = function() {
		var mapTemp = [];
		var chungN = 0;
		var index = 0;
		var isChung = false;
		var isUser = false;
		for (var y = 0; y < this.map.length; y++) {
			mapTemp[y] = [];
			for (var x = 0; x < this.map[y].length; x++) {
				if (this.map[y][x] === 0) {
					isUser = true;
					config.user = new Player({
						index: index,
						x : x,
						y : y
					});
				}else if (this.map[y][x] === 1) {
					chungN++;
					isChung = true;
					chung.push(new Chung({
						index: index,
						indexChung: chungN,
						x: x,
						y: y
					}));
				}
				mapTemp[y][x] = new Square({
					index: index,
					indexChung: chungN,
					isChung: isChung,
					isUser: isUser,
					x: x,
					y: y,
					shape:this.map[y][x].toString()
				});
				index++;
				isChung = false;
				isUser = false;
			}
		}
		this.layoutData = mapTemp;
	};
	Grid.prototype.render = function(callback) {
		var layoutHtml = '';
		for (var i = 0; i < this.layoutData.length; i++) {
			for (var j = 0; j < this.layoutData[i].length; j++) {
				layoutHtml += this.layoutData[i][j].render();
			}
			layoutHtml += '<div class="clearfix"></div>';
		}
		mapGenerated = this.layoutData;
		if(typeof callback === 'function'){
			callback.call(this);
		}
		return layoutHtml;
	};
	function init() {
		var layout = new Grid(map);
		layout.create();
		var container = $('#container');
		container.css('width', map.length * ( config.squareWidth + 2 ) + 'px');
		container.append(layout.render());
		container.append(config.user.render());
		container.append(htmlChung());
		prepareChungSteps();
		steps.push({
			user : config.user.index,
			chung: chungSteps.clone()
		});
		console.log(steps);
	}

	// Events :
	doc.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
			case 38:
				config.user.moveUp();
				console.log("up!");
				break;
			case 40:
				config.user.moveDown();
				console.log("down!");
				break;
			case 37:
				config.user.moveLeft();
				console.log("left!");
				break;
			case 39:
				config.user.moveRight();
				console.log("right!");
				break;
			default:
				console.log(event.keyCode);
		}
		console.log(config.user);
	}, false);
	init();
	console.log(chungSteps);
	/*console.log(doc);
	console.log(chung);*/
	//console.log(config.user);
	//console.log(config);
})(jQuery, document);
