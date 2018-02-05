/*global FB, i18n*/
Template.Challenge.events({
	'click .button__challenge': function() {
		/*var currentUrl = Router.current().url;
		if (currentUrl.indexOf('http') === -1) {
			currentUrl = Meteor.absoluteUrl(currentUrl.substring(1)); //substring to remove the initial /
		}*/

		var currentUrl = document.location.href + '?utm_source=facebook&utm_medium=challenge&utm_campaign=bcx2015';
		// var currentUrl = 'https://developers.facebook.com/apps/1604534863095419/review-status/';

		console.log('FB URL to share:', currentUrl);

		// var description = [i18n('challenge1'), i18n('challenge2'), i18n('challenge3'), i18n('challenge4'), i18n('challenge5'), i18n('challenge6')];
		var quote = i18n('challenge');

		var index = Math.floor(Math.random() * 6);

		// var mapId = Router.current().params.mapId;

		// var caption = i18n('round') + ' ' + mapId + ' - ' + i18n('bcx');

		// if (typeof mapId === 'undefined') {
		// 	caption = i18n('bcx') + ' ' + i18n('byNauStudio');
		// }

		//console.log(description[index], caption);

		FB.ui(
			{
				method: 'share',
				href: currentUrl, //share from current URL of the app
				quote,
				hashtag: '#banhchungxanh',
				mobile_iframe: true,
			},
			function(response) {
				if (response && response.post_id) {
					console.log('Post was published.');
				} else {
					console.log('Post was not published.');
				}
			}
		);
	},
});

Template.Challenge.helpers({
	inMapMaster: function() {
		var isHidden = '';
		if (Session.get('showGame')) {
			isHidden = 'hidden-smartphone';
		}
		return isHidden;
	},
});
