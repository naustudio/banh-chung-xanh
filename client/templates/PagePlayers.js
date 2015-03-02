/**
 * Players list
 */
/*global Modernizr, itemsPerPages: true*/
// number of players in each page
var itemsPerPages = 10;

Template.PagePlayers.helpers({
	players: function() {
		var players = [];
		var player = {} ;
		var currPlayer = {};	// current player

		var playersList = Meteor.users.find({});
		var playersObj = playersList.fetch();
		var userlist = [];
		var fl = null;
		var currF = null;
		var currUser = Meteor.user();

		userlist = playersObj;

		// add this user to first of players list
		var loginUser = setPlayerIndex(currUser, true);
		if (loginUser) {
			playersObj.filter(function(item, index) {
				var userId = item.services.facebook ? item.services.facebook.id.toString() : '';
				var FBUserId = currUser.services.facebook ? currUser.services.facebook.id.toString() : '';

				if (userId.toLowerCase() === FBUserId.toLowerCase()) {
					// remove this user in userlist
					userlist.splice(index, 1);
				}
			});
			players.push(loginUser);
		}

		// check facebook friends
		if (Session.get('friendsList')) {
			fl = Session.get('friendsList');

			if (fl && fl.length > 0) {
				for (var j = 0; j < fl.length; j++) {
					// get user in friends list in users collection
					/* jshint ignore:start */
					currF = playersObj.filter(function(item, index) {
						var userId = item.services.facebook ? item.services.facebook.id.toString() : '';
						var FBUserId = fl[j].id.toString();

						if (userId.toLowerCase() === FBUserId.toLowerCase()) {
							var a = userlist.splice(index, 1);

							return a;
						}
					});
					/* jshint ignore:end */

					if (currF[0]) {
						player = setPlayerIndex(currF[0], true);
						if (player) {
							players.push(player);
						}
					}
				}
			}
		}

		for (var i = 0; i < userlist.length; i++) {
			currPlayer = userlist[i];

			player = setPlayerIndex(currPlayer);
			if (player) {
				players.push(player);
			}
		}

		var list = getPlayersList(players);
		var pagesNo = players.length / itemsPerPages;

		if (players.length % itemsPerPages) {
			pagesNo++;
		}

		if (pagesNo) {
			pagesNo = parseInt(pagesNo, 10);
		}

		Session.set('pagesNo', pagesNo);

		return list;
	}
});

Template.PagePlayers.rendered = function() {
	Meteor.users.getUserFriendsList();

};

Template.PagePlayers.destroyed = function() {
	window.onscroll = null;
};

Template.PagePlayers.created = function() {
	Session.set('pageNo', 0);

	window.onscroll = function() {
		showPlayers();
	};
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
function setPlayerIndex(currPlayer, getProfilePic) {
	// get levels
	var gameScores = [];
	var player = {};

	if (currPlayer) {
		gameScores = currPlayer.gameScores;

		if (gameScores !== undefined) {
			player = getPlayerInfo(currPlayer, getProfilePic);

			return player;
		}
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

	if (currPlayer) {
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

	return false;
}

/**
 * get url for avatar
 */
function getPlayerInfoFacebook(currPlayer) {
	var player = {};
	var specSize = '';

	// check for retina
	if (Modernizr.mq('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)')) {
		specSize = '&width=100&height=100';
	}

	player.isFacebook = true;
	player.url = 'https://graph.facebook.com/' + currPlayer.services.facebook.id + '/picture?type=square' + specSize;

	return player;
}

/**
 * get players list
 */
function getPlayersList(list) {
	var pageNo = Session.get('pageNo') || 1;
	var len = pageNo * itemsPerPages;
	var result = [];

	if (len >= list.length) {
		len = list.length;
	}

	for (var i = 0; i < len; i++) {
		result.push(list[i]);
	}

	return result;
}

/**
 * show more players when user scroll up the page
 * to last player in current list
 */
function showPlayers() {
	var isPlayersList    = checkPlayersList();
	var scrollTop        = null; 	// scrollTop value
	var playersList      = null; 	// players list
	var lastPlayer       = null; 	// last player in players list
	var lastPlayerInfo = null; 	// last player offset
	var currentPageNo    = 1;    	// current page number in session
	var pagesNo = 0;

	// check is players list page
	if (isPlayersList) {
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		playersList = document.getElementsByClassName('names-list__record');
		lastPlayer = playersList[playersList.length - 1];

		if (lastPlayer) {
			// get offset and size of last player
			lastPlayerInfo = {
				y: lastPlayer.offsetTop,
				height: lastPlayer.clientHeight
			};

			if (scrollTop + window.innerHeight >= lastPlayerInfo.y + lastPlayerInfo.height) {
				currentPageNo = Session.get('pageNo') || 1;
				currentPageNo = parseInt(currentPageNo, 10);
				currentPageNo++;

				pagesNo = Session.get('pagesNo') || 0;
				pagesNo = parseInt(pagesNo, 10);

				if (currentPageNo <= pagesNo) {
					Session.set('pageNo', currentPageNo);
				}
			}
		}
	} else {
		return;
	}

}

/**
 * check page
 * checking last param in url
 */
function checkPlayersList() {
	var currUrl = Router.current().url;
	var params = currUrl.split('/');

	var page = params[params.length - 1];

	if (page === 'players') {
		return true;
	}

	return false;
}