/*global ga:true*/
Template.gridMap.rendered = function() {
	Session.set('mapRendered', false);
};

Template.gridMap.helpers({
	squares: function() {
		var game = Session.get('game');
		return game ? game.mapRenderedHTML : [];
	},
	isHidden: function() {
		var isHidden = 'hidden';
		return isHidden;
	},

	currentURL: function() {
		return window.location.href;
	},

	twitterText: function() {
		//TODO: use random translated text
		return 'Enjoy fun, do charity in 1 step via…';
	},
	rendered: function() {
		return Session.get('mapRendered');
	}
});

Template.gridMap.events({
	'click .social-icon': function(event) {
		var link = $(event.target).attr('href');
		var ref = $(event.target).data('ref');
		var width  = 575,
			height = 400,
			left   = ($(window).width()  - width)  / 2,
			top    = ($(window).height() - height) / 2,
			url    = link,
			opts   = 'status=1' +
			',width='  + width  +
			',height=' + height +
			',top='    + top    +
			',left='   + left;
		window.open(url, ref + Math.random(), opts);

		ga('send', 'event', 'button', 'click', 'Sharing ' + ref);

		return false;
	},
	'click .icon-round': function() {
		Session.set('showGame',false);
	}
});