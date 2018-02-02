// Bootstrap the app when server start here
/*global Assets, Settings, InitialSettings, Accounts, Sponsors, ServerSession:true, CheatingLogs */
var _calculateRemainingDate = function() {
	var endDate = Settings.getItem('endDate');
	var currentServerDate = new Date();
	var remainingDate = (endDate.valueOf() - currentServerDate.valueOf()) / (1000 * 60 * 60 * 24);
	remainingDate = Math.ceil(remainingDate);
	remainingDate = Math.max(remainingDate, 0);
	return remainingDate;
};

Meteor.startup(function() {
	Meteor.mapConfig = JSON.parse(Assets.getText('maps/maps-config.json'));

	Meteor.isAdmin = function(userId) {
		var adminUser = Meteor.adminUser;

		if (!adminUser) {
			adminUser = Meteor.users.findOne({ emails: { $elemMatch: { address: 'adminbcx@naustud.io' } } });
		}
		Meteor.adminUser = adminUser;
		return Meteor.adminUser && Meteor.adminUser._id === userId;
	};

	Meteor.isCheating = function(result) {
		var isCheating = true;
		var historySteps = result.historiesStep.split(',');
		var mapIndex = result.mapIndex;
		var myJSON = Meteor.mapConfig;
		var map = JSON.parse(Assets.getText(myJSON.maps[mapIndex].src));
		var dataChecking = map.dynamidObj;
		var user = dataChecking.user;
		var chungs = dataChecking.chung;
		var disks = dataChecking.disk;
		var checkingWon = 0;
		var i = 0,
			j = 0;

		var isPropositionObjects = function(obj1, obj2) {
			return obj1.x === obj2.x && obj1.y === obj2.y;
		};

		for (i = 0; i < historySteps.length; i++) {
			if (historySteps[i] === 'left') {
				user.x--;
				for (j = 0; j < chungs.length; j++) {
					if (isPropositionObjects(chungs[j], user)) {
						chungs[j].x--;
					}
				}
			} else if (historySteps[i] === 'right') {
				user.x++;
				for (j = 0; j < chungs.length; j++) {
					if (isPropositionObjects(chungs[j], user)) {
						chungs[j].x++;
					}
				}
			} else if (historySteps[i] === 'up') {
				user.y--;
				for (j = 0; j < chungs.length; j++) {
					if (isPropositionObjects(chungs[j], user)) {
						chungs[j].y--;
					}
				}
			} else if (historySteps[i] === 'down') {
				user.y++;
				for (j = 0; j < chungs.length; j++) {
					if (isPropositionObjects(chungs[j], user)) {
						chungs[j].y++;
					}
				}
			}
		}
		for (i = 0; i < disks.length; i++) {
			for (j = 0; j < chungs.length; j++) {
				if (isPropositionObjects(chungs[i], disks[i])) {
					checkingWon++;
				}
			}
		}

		isCheating = checkingWon === disks.length ? false : true;

		return isCheating;
	};

	InitialSettings.forEach(function(item) {
		if (Settings.findOne({ key: item.key }) === undefined) {
			// insert settings that are not available in the collection yet
			console.log('Setting item', item.key, 'not set. Adding to DB');
			Settings.insert(item);
		}
	}, this);

	Meteor.methods({
		map: function(mapNumber) {
			var map;
			if (mapNumber === undefined) {
				mapNumber = 0;
			}
			var myJSON = Meteor.mapConfig;
			if (myJSON && myJSON.maps && myJSON.maps[mapNumber].src) {
				var mapLevel = myJSON.maps[mapNumber].mapLevel;
				map = JSON.parse(Assets.getText(myJSON.maps[mapNumber].src));

				return {
					map: map,
					mapLevel: mapLevel,
				};
			}
		},

		startGame: function(mapId) {
			if (!Meteor.userId()) {
				return;
			}
			var session = {};
			session[mapId] = {
				startDate: new Date(),
			};
			ServerSession.set(Meteor.userId(), session);
		},

		getRemainingDate: function() {
			return _calculateRemainingDate();
		},

		getDonatedAmount: function() {
			var amount = Settings.getItem('donatedAmount');
			amount = amount ? amount : 0;
			return amount;
		},

		updateDonationTotal: function() {
			var mapConfig = Meteor.mapConfig;
			var sumOfDonation = 0;
			//console.log(Settings.find({}).fetch());
			Meteor.users.find({}).forEach(function(user) {
				var gameScores = user.gameScores ? user.gameScores : [];
				var level = 0;
				var value = 0;
				var valueObj = null;
				var i = 0;
				var j = 0;
				for (i = 0; i < gameScores.length; i++) {
					for (j = 1; j < mapConfig.maps.length; j++) {
						if (mapConfig.maps[j].index.toString() === gameScores[i].mapIndex.toString()) {
							level = mapConfig.maps[j].mapLevel;
							if (level) {
								valueObj = Settings.findOne({ key: mapConfig.mapsDonation[level.toString()] });
								value = parseInt(valueObj.value, 10);
								sumOfDonation += value;
								//console.log(gameScores[i].count,Settings.findOne({key: mapConfig.mapsDonation[level.toString()]}));
							}
						}
					}
				}
			});
			Settings.setItem('donatedAmount', sumOfDonation);
			return sumOfDonation;
		},

		userDonates: function(mapId) {
			if (!Meteor.userId()) {
				return 0;
			}
			var mapConfig = Meteor.mapConfig;
			var i = 0;
			var level = 0;
			var value = 0;
			var valueObj = null;
			var updateStatus = false;

			for (i = 1; i < mapConfig.maps.length; i++) {
				if (parseInt(mapId, 10) === mapConfig.maps[i].index) {
					updateStatus = true;
					level = mapConfig.maps[i].mapLevel;
					valueObj = Settings.findOne({ key: mapConfig.mapsDonation[level.toString()] });
					value = parseInt(valueObj.value, 10);
				}
			}
			Meteor.call('increaseDonatesAmount', value);
			return value;
		},

		arrayMappingDonation: function() {
			//var arrayDonation = [];
			var mapConfig = Meteor.mapConfig;
			var i = 0;
			var level = 0;
			var value = 0;
			var valueObj = null;
			var tempItemDonation = {};
			console.log('mapConfig', mapConfig.maps);
			for (i = 1; i < mapConfig.maps.length; i++) {
				level = mapConfig.maps[i].mapLevel;
				valueObj = Settings.findOne({ key: mapConfig.mapsDonation[level.toString()] });
				value = parseInt(valueObj.value, 10);
				tempItemDonation[mapConfig.maps[i].index.toString()] = value;
				//arrayDonation.push(tempItemDonation);
			}

			return tempItemDonation;
		},

		increaseDonatesAmount: function(money) {
			var donatedAmount = Settings.getItem('donatedAmount');
			Settings.setItem('donatedAmount', donatedAmount + money);
		},

		updateUserScore: function(mapId, result) {
			mapId = mapId.toString();
			var user = Meteor.user();
			if (!user) {
				return false;
			}
			var isCheating = Meteor.isCheating(result);
			var loggedObject = {};
			if (isCheating) {
				loggedObject = JSON.parse(JSON.stringify(result));
				loggedObject.userId = user._id;
				CheatingLogs.upsert({ userId: Meteor.userId(), mapIndex: mapId }, loggedObject);
				console.log('This guy, ' + Meteor.userId() + ', is cheating');
			}

			var finding = Meteor.users.find({
				_id: Meteor.userId(),
				gameScores: {
					$elemMatch: {
						mapIndex: mapId,
					},
				},
			});
			console.log(finding.count(), mapId);
			if (finding.count()) {
				Meteor.users.update(
					{
						_id: Meteor.userId(),
						gameScores: {
							$elemMatch: {
								mapIndex: mapId,
							},
						},
					},
					{
						$set: {
							'gameScores.$.elapsedTime': result.elapsedTime,
							'gameScores.$.usedSteps': result.usedSteps,
							'gameScores.$.count': result.count,
							'gameScores.$.updatedAt': result.updatedAt,
						},
					}
				);
			} else {
				Meteor.users.update(
					{
						_id: user._id,
					},
					{
						$push: {
							gameScores: result,
						},
					}
				);
			}

			return result;
		},
	});

	/*
		Set up security for all of collection that we need to protect from anonymous access
	*/
	// Users collection
	Meteor.users.allow({
		insert: function(/*userID, document*/) {
			//TODO we need to check if permitted to perform this operation.
			return false;
		},
		update: function(userID /*, document*/) {
			//TODO we need to check if permitted to perform this operation.
			console.log('=== update' + userID);

			return !!Meteor.user();
		},
		remove: function(userID /*, document*/) {
			//TODO we need to check if permitted to perform this operation.
			console.log('=== removed' + userID);
			return false;
		},
	});

	Settings.allow({
		insert: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.adminId && userId === Meteor.adminId;
		},
		update: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
		remove: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
	});

	Settings.allow({
		insert: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			// console.log('=== insert' + userID);
			return Meteor.isAdmin(userId);
		},
		update: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
		remove: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			// console.log('=== removed' + userID);
			return Meteor.isAdmin(userId);
		},
	});

	Sponsors.allow({
		insert: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
		update: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
		remove: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
	});

	Meteor.setInterval(function() {
		var remainingDate = _calculateRemainingDate();
		Settings.setItem('remainingDate', remainingDate);
	}, 10000);

	//Capture account events
	Accounts.onCreateUser(function(options, user) {
		var profile = options.profile || {};

		var usedPasswordService = !!options.password;

		if (usedPasswordService) {
			profile.name = options.username || profile.name;
		}

		user.lastAccess = new Date().valueOf();

		user.profile = profile;

		return user;
	});

	Accounts.onLogin(function(options) {
		Meteor.users.update(
			{
				_id: options.user._id,
			},
			{
				$set: {
					lastAccess: new Date().valueOf(),
				},
			}
		);
	});

	Meteor.call('updateDonationTotal');
});
