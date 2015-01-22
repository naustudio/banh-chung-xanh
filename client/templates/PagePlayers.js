/**
 * Players list
 */
/*global Players, Player*/
Template.PagePlayers.helpers({
	players: function() {
		return Players.find({});
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

		var player = new Player({
			name: name,
			avatar: '',
			duration: parseInt(duration, 10),
			maxRound: parseInt(maxRound, 10),
			lastAccess: new Date()
		});

		Players.insert(player);

		// reset value
		$name.val('');
		$maxRound.val('');
		$duration.val('');
	}
});