/* © 2014 nau.com
 * @author Phuong Vo
 */
/**/
var game = null;

var completeGame = function(result) {
	var mapLevel = Session.get('mapLevel');
	setTimeout(function() {
		$('.modal-congratulation-level' +mapLevel).modal('show');
	}, 400);
	console.log('win result ' + result);
	var mapId = result.mapIndex;

	Meteor.call('userDonates', mapId, function(err, value) {
		Session.set('userLastDonation', value);
		Meteor.call('updateDonationTotal');
	});

	//user already loggin
	var user = Meteor.user();
	if (user) {
		var gameScoresOfUser = user.gameScores;
		if (!gameScoresOfUser) {	//create new property for user
			Meteor.users.update({
				_id:Meteor.user()._id
			}, {
				$set:{
					'gameScores':[]
				}
			});
			gameScoresOfUser = [];
		}

		var foundScoreItem = getTheScoreItemByMapId(gameScoresOfUser, mapId);
		if (foundScoreItem) {
			Meteor.users.update({
				_id:Meteor.user()._id,
				'gameScores.mapIndex':foundScoreItem.mapIndex
			}, {
				$set:{
					'gameScores.elapsedTime':result.elapsedTime,
					'gameScores.usedSteps':result.usedSteps,
					'gameScores.count':foundScoreItem.count + 1,
					'gameScores.updatedAt':Date.now()
				}
			});
		} else {
			//add new score item
			result.updatedAt = Date.now();
			result.count = 1;
			Meteor.users.update({
				_id:Meteor.user()._id
			}, {
				$push:{
					'gameScores':result
				}
			});
		}
	}

};

var getTheScoreItemByMapId = function(gameScoresOfUser, mapId) {
	for (var i = 0; i < gameScoresOfUser.length; i++) {
		var scoreItem = gameScoresOfUser[i];
		if (scoreItem.mapIndex === mapId) {
			return scoreItem;
		}
	}
	return null;
};

Template.PageGame.helpers({
	'rendered': function() {
		//
		Session.set('showGame', true);
		//
		var mapId = Router.current().params.mapId;
		//
		Session.set('nextMapId', parseInt(mapId,10) + 1);
		//
		Meteor.call('map', mapId, function(error, result) {
			//we parse the game and init the game
			game = new window.chungapp.Game();
			game.setJSONMapData(result.map, mapId);
			var mapLevel = result.mapLevel;
			Session.set('mapLevel', mapLevel);

			// console.log('result', result);
			game.startGame();

			Session.set('game', game);
			Session.set('steps', 0);

			// game.getNumStep() -> mapResolver.getHistoryNum() is a reactive getter
			Tracker.autorun(function() {
				var steps = game ? game.getNumStep() : 0;
				Session.set('steps', steps);
			});

			// bind keyboard events, will move to an input controller
			$('body').off('keyup keydown').on({
				'keydown': function(event) {
					var direction = '';

					switch (event.keyCode) {
						case 37:
							direction = 'Left';
							break;
						case 38:
							direction = 'Up';
							break;
						case 39:
							direction = 'Right';
							break;
						case 40:
							direction = 'Down';
					}

					if (direction && game) {
						var result = game['go' + direction]();
						if (result !== null) {
							completeGame(result);
						}
						event.preventDefault();
					}
				}
			});
		});
		return '';
	}
});

Template.PageGame.events({
	'click .control-top' : function(/*event*/) {
		console.log('==move top');
		var result = game.goUp();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .control-left' : function(/*event*/) {
		console.log('==move left');
		var result = game.goLeft();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .control-right' : function(/*event*/) {
		console.log('==move right');
		var result = game.goRight();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .control-bottom' : function(/*event*/) {
		console.log('==move bottom');
		var result = game.goDown();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .icon-reset' : function(/*event*/) {
		console.log('==restart');
		game.restart();
	},

	'click .icon-back' : function(/*event*/) {
		console.log('==undo');
		game.undo();
	}
});
