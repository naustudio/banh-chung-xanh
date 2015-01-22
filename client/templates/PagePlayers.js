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
		var name = el.$('.name').val();
		var maxRound = el.$('.max-round').val();
		var duration = el.$('.duration').val();

		var player = new Player({
			name: name,
			avatar: '',
			duration: parseInt(duration, 10),
			maxRound: parseInt(maxRound, 10),
			lastAccess: new Date()
		});

		Players.insert(player);
	}
});