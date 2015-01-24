/*global Accounts*/
Template.Login.events({
	'submit form': function (e) {
		e.stopPropagation();
		e.preventDefault();

	},

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

Template.Login.rendered = function () {
	var onCreateUserHandler = function (error) {
		if (error) {
			console.log('User creation is unsuccessful');
		} else {
			console.log('User creation is successful');
			$('.modal-login').modal('hide');
		}
	};
	$('#login').validate({
		rules: {
			name: {
				required: true,
				maxlength: 50
			},
			email: {
				required: true,
				email: true,
				maxlength: 50
			},
			privacy: {
				required: true
			}
		},
		messages: {
			email : {
				required: "Please enter your email address to login.",
        		email: "Please enter a valid email address."
			}
		},
		submitButtons: 'button[type="submit"]',

		errorPlacement: function (error, element) { // render error placement for each input type
			var icon = $(element).parent('.input-with-icon').children('i');
			var parent = $(element).parent('.input-with-icon');
			icon.removeClass('icon-ok').addClass('icon-alert');
			parent.removeClass('success-control').addClass('error-control');
			$('<span class="error-block"></span>').insertAfter(element).append(error);
		},

		submitHandler: function () {
			var user = {
				email: $('[name="email"]').val(),
				username: $('[name="name"]').val(),
				password: '12345',
				profile: {}
			};
			Meteor.loginWithPassword(user.email, user.password, function (error) {
				if (error) {
					Accounts.createUser(user, onCreateUserHandler);
				} else {
					$('.modal-login').modal('hide');
				}
			});
		}
	});
};