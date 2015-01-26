
Template.Challenge.events ({
	'click .button__challenge': function() {
		FB.ui ({
			method: 'share',
			href: 'https://developers.facebook.com/docs/',
			name: 'Facebook Dialogs',
			link: 'https://developers.facebook.com/docs/dialogs/',
			caption: 'Reference Documentation',
			description: 'Lorem ipsum dolor sit amet, consectetur arum aliquam reprehenderit laudantium disti. Dicta.'
		}, function(response) {
			if (response && response.post_id) {
				console.log('Post was published.');
			} else {
				console.log('Post was not published.');
			}
		});
	}
});