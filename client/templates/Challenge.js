/*global FB, i18n*/
Template.Challenge.events ({
	'click .button__challenge': function() {
		var currentUrl = Router.current().url;
		if (currentUrl.indexOf('http') === -1) {
			currentUrl = Meteor.absoluteUrl(currentUrl.substring(1)); //substring to remove the initial /
		}

		//var currentUrl = document.location.origin;

		console.log('FB URL to share:', currentUrl);

		var description = [i18n('challenge1'), i18n('challenge2'), i18n('challenge3'), i18n('challenge4')];

		var index = Math.floor((Math.random() * 4));

		var mapId = Router.current().params.mapId;

		var caption ='Thử thách '+mapId+' - Bánh Chưng Xanh';

		if (typeof(mapId) === 'undefined') {
			caption = 'Bánh Chưng Xanh by Nau Studio';
		}

		//console.log(description[index], caption);

		FB.ui({
			method: 'feed',
			//href: currentUrl, //share from current URL of the app
			link: currentUrl,
			caption: caption,
			description: description[index]
		}, function(response) {
			if (response && response.post_id) {
				console.log('Post was published.');
			} else {
				console.log('Post was not published.');
			}
		});
	}


});

Template.Challenge.helpers ({
	'inMapMaster': function() {
		var isHidden = '';
		if (Session.get('showGame')) {
			isHidden= 'hidden-smartphone';
		}
		return isHidden;
	}
});