Template.Congratulation.events ({
	'click .congratulation-button': function () {
		$('.modal-congratulation').modal('hide');
	},

	'click .modal-congratulation-dialog': function() {
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

	'nextMapId': function() {
		return Session.get('nextMapId');
	},
	'mapLevel': function() {
		return Session.get('mapLevel');
	}
});