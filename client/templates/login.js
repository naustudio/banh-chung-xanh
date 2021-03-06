/*global Accounts, i18n*/

Template.Login.helpers({
	congratulationLogin: function() {},
});

Template.Login.updateUserAfterLoggingIn = function() {
	var temporaryUserData = Session.get('temporaryUserData');
	var mapId = Session.get('mapLevel');
	if (temporaryUserData && Meteor.userId() !== null) {
		Meteor.users.updateUserData(Meteor.userId(), temporaryUserData, mapId);
		Session.set('temporaryUserData', null);
	}
};

Template.Login.events({
	'submit form': function(e) {
		e.stopPropagation();
		e.preventDefault();
	},

	'click .facebook-login': function(e) {
		e.stopPropagation();
		e.preventDefault();

		Meteor.loginWithFacebook(
			{
				requestPermissions: ['public_profile', 'email', 'user_friends'],
			},
			function(err) {
				if (err) {
					throw new Meteor.Error('Facebook login failed -------------------', err);
				} else {
					console.log('Log in thanh cong');
					$('.modal-login').modal('hide');
					Template.Login.updateUserAfterLoggingIn();
					// get friends list of user
					Meteor.users.getUserFriendsList();
				}
			}
		);
	},

	'click .logout': function(e) {
		e.stopPropagation();
		e.preventDefault();

		Meteor.logout(function(err) {
			if (err) {
				throw new Meteor.Error('Logout failed');
			}
		});
	},

	'click .modal-dialog': function(e) {
		if (e.target === e.currentTarget) {
			var error = $('#login').find('.error-block');
			error.remove();
		}
	},

	'click button.close': function() {
		var error = $('#login').find('.error-block');
		error.remove();
	},

	'click .button-cancel': function() {
		var error = $('#login').find('.error-block');
		error.remove();
		$('.modal-login').modal('hide');
	},
});

Template.Login.rendered = function() {
	var onCreateUserHandler = function(error) {
		if (error) {
			console.log('User creation is unsuccessful');
		} else {
			console.log('User creation is successful');
			$('.modal-login').modal('hide');
			Template.Login.updateUserAfterLoggingIn();
		}
	};
	$('#login').validate({
		rules: {
			name: {
				required: true,
				maxlength: 50,
			},
			email: {
				required: true,
				email: true,
				maxlength: 50,
			},
			privacy: {
				required: true,
			},
		},
		messages: {
			email: {
				required: i18n('requiredError'),
				email: i18n('emailError'),
			},
			name: {
				required: i18n('requiredError'),
			},
			privacy: {
				required: i18n('privacyRequiredError'),
			},
		},
		submitButtons: 'button[type="submit"]',

		errorPlacement: function(error, element) {
			// render error placement for each input type
			var icon = $(element)
				.parent('.input-with-icon')
				.children('i');
			var parent = $(element).parent('.input-with-icon');
			icon.removeClass('icon-ok').addClass('icon-alert');
			parent.removeClass('success-control').addClass('error-control');
			$('<span class="error-block"></span>')
				.insertAfter(element)
				.append(error);
		},

		submitHandler: function() {
			var user = {
				email: $('[name="email"]').val(),
				username: $('[name="name"]').val(),
				password: '12345',
				profile: {},
			};
			Meteor.loginWithPassword(user.email, user.password, function(error) {
				if (error) {
					Accounts.createUser(user, onCreateUserHandler);
				} else {
					$('.modal-login').modal('hide');
					Template.Login.updateUserAfterLoggingIn();
				}
			});

			if (Session.get('congratulationLogin')) {
				Router.go('/' + Session.get('language') + '/game/' + Session.get('nextMapId'));
			}
		},
	});
};
