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
	}
});
