Template.Congratulation.events ({
	'click .congratulation-button': function () {
		$('.modal-congratulation').modal('hide');
	}
});

Template.Congratulation.helpers ({
	'nextMapId': function () {
		return Session.get('nextMapId');
	}
});