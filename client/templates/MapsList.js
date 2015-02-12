var gameScoresTmp = [{
			'mapIndex': 1,
			'elapsedTime': 60,
			'usedSteps': 10,
			'updatedAt': 1422328924902,
			'count': 0
		},
		{
			'mapIndex': 2,
			'elapsedTime': 60,
			'usedSteps': 10,
			'updatedAt': 1422328924902,
			'count': 0
		},
		{
			'mapIndex': 9,
			'elapsedTime': 60,
			'usedSteps': 10,
			'updatedAt': 1422328924902,
			'count': 0
		}];

Template.MapList.helpers({
	'rerenderMapMaster': function() {
		var user = Meteor.user();
		var gameScores = (user && user.gameScores &&  user.gameScores.length) ? user.gameScores : [];//gameScoresTmp;
		if (user) {
			for (var i= 0; i<gameScores.length; i++) {
				var index = gameScores[i].mapIndex;
				if (index <= 4) {
					$('.round-' + index).addClass('unlock-1');
				}
				else if (index <= 7) {
					$('.round-' + index).addClass('unlock-2');
				}
				else {
					$('.round-' + index).addClass('unlock-3');
				}
			}
		}
		else {
			for (var i=1; i<=10; i++) {
				$('.round-' + i).removeClass('unlock-1');
				$('.round-' + i).removeClass('unlock-2');
				$('.round-' + i).removeClass('unlock-3');
			}
		}
		return '';
	}
});

Template.MapList.events({
	'click .chose-round': function() {
		Session.set('showGame',true);
	},
	'click .map-wrap': function() {
		var user = Meteor.user();
		console.log(user);
	}
});

Template.MapList.rendered = function() {

	Session.set('showGame', false);

	var user = Meteor.user();
	var gameScores = (user && user.gameScores &&  user.gameScores.length) ? user.gameScores : [];

	if (user) {
		for (var i= 0; i<gameScores.length; i++) {
			var index = gameScores[i].mapIndex;
			if (index <= 4) {
				$('.round-' + index).addClass('unlock-1');
			}
			else if (index <= 7) {
				$('.round-' + index).addClass('unlock-2');
			}
			else {
				$('.round-' + index).addClass('unlock-3');
			}
		}
	}
	else {
		for (var i=1; i<=10; i++) {
			$('.round-' + i).removeClass('unlock-1');
			$('.round-' + i).removeClass('unlock-2');
			$('.round-' + i).removeClass('unlock-3');
		}
	}

};