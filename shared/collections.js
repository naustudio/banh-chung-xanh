/* © 2014 NauStud.io
 * @author
 */
/* global Sponsors: true, Settings:true */
// make collections here

// Players collection is now Meteor.users

// Sponsors collection
Sponsors = new Meteor.Collection('sponsors');

// Settings collection
Settings = new Meteor.Collection('settings');

Settings.getItem = function(key) {
	var item = this.findOne({key: key});
	return (item ? item.value : null);
};

Settings.setItem = function(key, value) {
	var settingItem = this.findOne({key: key});
	return this.update(settingItem._id, {key: key, value: value});
};


Meteor.users.updateUserData = function(userID, temporaryUserData, mapId) {
	var user = Meteor.users.findOne({_id:userID});
	console.log(user);
	var gameScoresOfUser = user.gameScores;
	if (!gameScoresOfUser) {	//create new property for user
		this.update({
			_id:userID
		}, {
			$set:{
				'gameScores':[]
			}
		});
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
		this.update({
			_id:userID
		}, {
			$push:{
				'gameScores':temporaryUserData
			}
		});

		Meteor.call('userDonates', mapId, function(err, value) {
			Session.set('userLastDonation', value);
		});
	}
};

Meteor.users.getTheScoreItemByMapId = function(gameScoresOfUser, mapId) {
	for (var i = 0; i < gameScoresOfUser.length; i++) {
		var scoreItem = gameScoresOfUser[i];
		if (scoreItem.mapIndex === mapId) {
			return scoreItem;
		}
	}
	return null;
};