/*global FB*/
Template.Challenge.events ({
	'click .button__challenge': function() {
		var currentUrl = Router.current().url;
		if (currentUrl.indexOf('http') === -1) {
			currentUrl = Meteor.absoluteUrl(currentUrl.substring(1)); //substring to remove the initial /
		}

		console.log('FB URL to share:', currentUrl);
		var description = [
			'Bạn khâm phục thành tích chơi của mình? Vậy hãy thử thách bạn bè của mình để quyên được nhiều tiền hơn cho các em nhỏ.',
			'Bạn nghĩ chẳng ai có thể chơi giỏi hơn mình? Hãy thách bạn bè cùng chơi để chứng tỏ nào!',
			'Đây có phải thành tích tốt nhất chưa? Mời bạn bè cùng chơi để xem nhé.',
			'Không ai có thể giải nhanh hơn bạn? Thách bạn bè nào!'
		];

		var index = Math.floor((Math.random() * 4));

		var mapId = Router.current().params.mapId;
		var caption ='Thử thách '+mapId+' - Bánh Chưng Xanh';

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
	},


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