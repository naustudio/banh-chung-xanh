
Template.Challenge.events ({
	'click .button__challenge': function() {
		FB.ui({
			method: 'share',
			href: Meteor.absoluteUrl(''), //share from the root of the app
			// link: 'https://developers.facebook.com/docs/dialogs/',
			// caption: 'Reference Documentation',
			// description: 'Lorem ipsum dolor sit amet, consectetur arum aliquam reprehenderit laudantium disti. Dicta.'
		}, function(response) {
			if (response && response.post_id) {
				console.log('Post was published.');
			} else {
				console.log('Post was not published.');
			}
		});
	}
});