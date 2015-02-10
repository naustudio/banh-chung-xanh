/**
 * Players list
 */
/*global Modernizr, FB*/
Template.PagePlayers.helpers({
	players: function() {
		var players = [];
		var player = {} ;
		var currPlayer = {};	// current player
		var levels = '';		// level list
		var gameScores = [];	// game score list

		var playersList = Meteor.users.find({});
		var playersObj = playersList.fetch();
		var index = 1;

		for (var i = 0; i < playersObj.length; i++) {
			currPlayer = playersObj[i];
			// get levels
			levels = '';
			gameScores = [];
			gameScores = currPlayer.gameScores;

			if (gameScores !== undefined) {
				player = getPlayerInfo(currPlayer);
				player.index = index++;

				players.push(player);
			}
		}

		// get friend list
		getFriendsList();

		return players;
	}
});

/**
 * format date to ''dd/mm/yyy'
 */
function formatDate(date) {
	date = date || new Date();
	var dd = date.getDate();
	var mm = date.getMonth() + 1;	// month [0 - 11]
	var yyyy = date.getFullYear();

	return [dd, mm, yyyy].join('/');
}

/**
 * get information of player
 * @param  {[type]} currPlayer [description]
 * @return {[type]}            [description]
 */
function getPlayerInfo(currPlayer) {
	var player = {};
	var lastAccess = null;
	var levels = '';
	var fl = null;

	// get extra information of user
	if (currPlayer.services.facebook) {
		player = getPlayerInfoFacebook(currPlayer);
		fl = getFriendsList();
	}

	player.name = currPlayer.profile ? currPlayer.profile.name : '';
	lastAccess = currPlayer.lastAccess ? new Date(currPlayer.lastAccess) : new Date();

	lastAccess = formatDate(lastAccess);


	for (var j = 0; j < currPlayer.gameScores.length; j++) {
		if (j === currPlayer.gameScores.length - 1) {
			levels += currPlayer.gameScores[j].mapIndex;
		} else {
			levels += currPlayer.gameScores[j].mapIndex + ', ';
		}
	}

	player.lastAccess = lastAccess;	player.facebook = true;
	player.levels = levels;

	return player;
}

/**
 * get url for avatar
 */
function getPlayerInfoFacebook(currPlayer) {
	var player = {};
	var type = 'square';

	// check for retina
	if (Modernizr.mq('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)')) {
		type = 'large';
	}

	player.isFacebook = true;
	player.url = 'https://graph.facebook.com/' + currPlayer.services.facebook.id + '/picture?type=' + type;

	return player;
}

function getFriendsList() {
	FB.getLoginStatus(function(res) {
		if (res && res.status === 'connected') {
			FB.api(
				'me/friends',
				function(res) {
					if (res && !res.error) {
						return res;
					}
				});
		}
	});
}
