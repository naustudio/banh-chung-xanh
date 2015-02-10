/**
 * Players list
 */
/*global Modernizr*/
Template.PagePlayers.helpers({
	players: function() {
		var players = [];
		var player = {} ;
		var currPlayer = {};	// current player

		var playersList = Meteor.users.find({});
		var playersObj = playersList.fetch();
		var index = 1;
		var userlist = [];
		var fl = null;
		var currF = null;

		userlist = playersObj;

		// add this user to first of players list
		var loginUser = setPlayerIndex(Meteor.user(), index++, true);
		if (loginUser) {
			players.push(loginUser);
		}

		// check facebook friends
		if (Session.get('friendsList')) {
			fl = Session.get('friendsList');

			if (fl && fl.length > 0) {
				for (var j = 0; j < fl.length; j++) {
					// get user in friends list in users collection
					currF = playersObj.filter(function(item, index) {
						var userId = item.services.facebook ? item.services.facebook.id.toString() : '';
						var FBUserId = fl[j].id.toString();

						if (userId.toLowerCase() === FBUserId.toLowerCase()) {
							var a = userlist.splice(index, 1);

							return a;
						}
					});

					if (currF[0]) {
						player = setPlayerIndex(currF[0], index++, true);
						if (player) {
							players.push(player);
						}
					}
				}
			}
		}

		for (var i = 0; i < userlist.length; i++) {
			currPlayer = userlist[i];

			player = setPlayerIndex(currPlayer, index++);
			if (player) {
				players.push(player);
			}
		}

		return players;
	}
});

Template.PagePlayers.rendered = function() {
	Meteor.users.getUserFriendsList();
};

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
 *
 */
function setPlayerIndex(currPlayer, index, getProfilePic) {
	// get levels
	var gameScores = [];
	var player = {};

	gameScores = currPlayer.gameScores;

	if (gameScores !== undefined) {
		player = getPlayerInfo(currPlayer, getProfilePic);
		player.index = index;

		return player;
	}
}

/**
 * get information of player
 * @param  {[type]} currPlayer [description]
 * @return {[type]}            [description]
 */
function getPlayerInfo(currPlayer, getProfilePic) {
	var player = {};
	var lastAccess = null;
	var levels = '';

	// get extra information of user
	if (currPlayer.services.facebook && getProfilePic) {
		player = getPlayerInfoFacebook(currPlayer);
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

	player.lastAccess = lastAccess; //	player.facebook = true;
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
