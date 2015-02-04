Template.Congratulation.events ({
	'click .congratulation-button': function() {
		$('.modal-congratulation').modal('hide');
	},
	'click .modal-congratulation-dialog': function(/*e*/) {
		if ($(event.target).hasClass('modal-congratulation-dialog')) {
			document.location='/'+Session.get('language');

		}
	}

});

Template.Congratulation.helpers ({
	userLastDonation: function() {
		return Session.get('userLastDonation');
	},

	'nextMapId': function() {
		return Session.get('nextMapId');
	}
});