/**
 * Players list
 */
/*global User*/
Template.PagePlayers.helpers({
	players: function() {
		var players = Meteor.users.find({});
		var playersObj = players.fetch();

		for (var i = 0; i < playersObj.length; i++) {
			playersObj[i].index = i + 1;
		}

		return playersObj;
	}
});

Template.PagePlayers.events({
	'submit #add-player-form': function(event, el) {
		// get value
		var $name = el.$('.name');
		var $maxRound = el.$('.max-round');
		var $duration = el.$('.duration');

		var name = $name.val();
		var maxRound = $maxRound.val();
		var duration = $duration.val();

		var player = new User({
			name: name,
			avatar: '',
			duration: parseInt(duration, 10),
			maxRound: parseInt(maxRound, 10),
			lastAccess: new Date()
		});

		Meteor.users.insert(player);

		// reset value
		$name.val('');
		$maxRound.val('');
		$duration.val('');
	}
});