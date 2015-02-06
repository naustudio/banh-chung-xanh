Template.Congratulation.events ({
	'click .congratulation-button': function() {
		$('.modal-congratulation').modal('hide');
	},
	'click .modal-congratulation-dialog': function(/*e*/) {
		if ($(event.target).hasClass('modal-congratulation-dialog')) {
			Router.go('/'+Session.get('language'));
			//document.location='/'+Session.get('language');

		}
	},

	'click .congratulation-login': function(e) {
		var target = $(e.target).attr('data-target');
		$(target).modal('show');
		Session.set('congratulationLogin', true);
	}

});

Template.Congratulation.helpers ({
	userLastDonation: function() {
		return Session.get('userLastDonation');
	},

	'nextMapId': function() {
		return Session.get('nextMapId');
	},

	'mapLevel': function() {
		return Session.get('mapLevel');
	},

	'mapUnlock': function() {
		var mapUnlock = false;
		var user = Meteor.user();
		var gameScores = (user && user.gameScores &&  user.gameScores.length) ? user.gameScores : [];//gameScoresTmp;

		for (var i= 0; i<gameScores.length; i++) {
			var index = gameScores[i].mapIndex;
			if (parseInt(Session.get('mapLevel'),10) === parseInt(index,10)) {
				mapUnlock = true;
			}
		}

		return mapUnlock;
	}

});
