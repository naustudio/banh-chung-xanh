/**
 * Players list
 */
Template.PagePlayers.helpers({
	players: function() {
		var players = [];
		var player = {} ;
		var currPlayer = {};	// current player
		var levels = '';		// level list
		var gameScores = [];	// game score list

		var playersList = Meteor.users.find({});
		var playersObj = playersList.fetch();

		for (var i = 0; i < playersObj.length; i++) {
			currPlayer = playersObj[i];
			player = {};
			player.index = i + 1;

			// get infomation from Meteor users list
			// if user login from facebook

			player.name = currPlayer.profile ? currPlayer.profile.name : '';
			player.lastAccess = currPlayer.lastAccess ? new Date(currPlayer.lastAccess).toDateString() : '';

			// get levels
			levels = '';
			gameScores = [];
			gameScores = currPlayer.gameScores;
			if (gameScores !== undefined) {
				for (var j = 0; j < currPlayer.gameScores.length; j++) {
					if (j === currPlayer.gameScores.length - 1) {
						levels += currPlayer.gameScores[j].mapIndex;
					} else {
						levels += currPlayer.gameScores[j].mapIndex + ', ';
					}
				}
			}

			player.levels = levels;
			players.push(player);
		}

		return players;
	}
});