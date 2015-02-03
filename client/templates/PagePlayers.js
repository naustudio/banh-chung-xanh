/**
 * Players list
 */
/*global User*/
Template.PagePlayers.helpers({
	players: function() {
		var players = [];
		var player = {} ; /*{
			index: '',
			name: '',
			duration: '',
			maxRound: '',
			lastAccess: ''
		};*/

		var playersList = Meteor.users.find({});
		var playersObj = playersList.fetch();

		for (var i = 0; i < playersObj.length; i++) {
			player = {};
			player.index = i + 1;

			// get infomation from Meteor users list
			// if user login from facebook
			if (playersObj[i].services.facebook === undefined) {
				// user login via email
				player.name = playersObj[i].username;
			} else {
				// user login via facebook
				player.name = playersObj[i].username;
			}

			players.push(player);
		}

		return players;
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