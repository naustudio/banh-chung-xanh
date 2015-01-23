Template.Login.events({
	'click .facebook-login': function(e) {
		e.stopPropagation();
		e.preventDefault();

		Meteor.loginWithFacebook({}, function(err) {
			if (err) {
				throw new Meteor.Error("Facebook login failed");
			} else {
				$('.modal-login').modal('hide');
			}
		});
	},

	'click .logout': function(e) {
		e.stopPropagation();
		e.preventDefault();

		Meteor.logout(function(err) {
			if (err) {
				throw new Meteor.Error("Logout failed");
			}
		});
	}
});