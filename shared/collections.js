/* © 2014 NauStud.io
 * @author
 */
/* global Sponsors: true, Settings:true, FB: true, CheatingLogs: true  */
// make collections here

// Players collection is now Meteor.users
CheatingLogs = new Meteor.Collection('cheating_logs');
// Sponsors collection
Sponsors = new Meteor.Collection('sponsors');

// Settings collection
Settings = new Meteor.Collection('settings');

var mappingGameDonation = {
	'1': 10,
	'2': 10,
	'3': 10,
	'4': 10,
	'5': 20,
	'6': 20,
	'7': 20,
	'8': 50,
	'9': 50,
	'10': 50,
};

Settings.getItem = function(key) {
	var item = this.findOne({ key: key });
	return item ? item.value : null;
};

Settings.setItem = function(key, value) {
	var settingItem = this.findOne({ key: key });

	if (settingItem) {
		return this.update(settingItem._id, { $set: { key: key, value: value } });
	}
};

Meteor.users.setTotalScore = function(userId, mapId) {};

Meteor.users.updateUserData = function(userID, temporaryUserData, mapId) {
	var user = Meteor.users.findOne({ _id: userID });
	var gameScoresOfUser = user.gameScores;

	if (!gameScoresOfUser) {
		//create new property for user
		this.update(
			{
				_id: userID,
			},
			{
				$set: {
					gameScores: [],
				},
			}
		);
		gameScoresOfUser = [];
	}

	var foundScoreItem = this.getTheScoreItemByMapId(gameScoresOfUser, mapId);

	if (foundScoreItem) {
		temporaryUserData.updatedAt = Date.now();
		temporaryUserData.count = foundScoreItem.count + 1;

		Meteor.call('updateUserScore', mapId, temporaryUserData);
	} else {
		//add new score item
		temporaryUserData.updatedAt = Date.now();
		temporaryUserData.count = 1;
		/*this.update({
			_id:userID
		}, {
			$push:{
				'gameScores':temporaryUserData
			}
		});*/
		Meteor.call('updateUserScore', mapId.toString(), temporaryUserData);
		Meteor.call('userDonates', mapId.toString(), function(err, value) {
			Session.set('userLastPoint', value);
		});
	}
};

Meteor.users.getTotalScore = function(userId) {
	if (userId) {
		var user = this.findOne({ _id: userId });
		var gameScores = user ? user.gameScores : [];

		if (gameScores.length > 0) {
			var totalScore = 0;

			gameScores.forEach(item => {
				totalScore += mappingGameDonation[item.mapIndex.toString()];
			});

			return totalScore;
		}
	} else {
		return 0;
	}
};

Meteor.users.getTheScoreItemByMapId = function(gameScoresOfUser, mapId) {
	for (var i = 0; i < gameScoresOfUser.length; i++) {
		var scoreItem = gameScoresOfUser[i];
		if (parseInt(scoreItem.mapIndex, 10) === parseInt(mapId, 10)) {
			return scoreItem;
		}
	}
	return null;
};

Meteor.users.getUserFriendsList = function() {
	// call service to get friends list of user
	if (FB) {
		FB.getLoginStatus(function(res) {
			if (res && res.status === 'connected') {
				FB.api('me/friends', function(res) {
					if (res && !res.error) {
						var data = res.data || [];

						Session.set('friendsList', data);
					}
				});
			}
		});
	}
};
