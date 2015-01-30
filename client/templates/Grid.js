Template.gridMap.rendered = function() {

};

Template.gridMap.helpers({
	squares: function() {
		var game = Session.get('game');
		return game ? game.mapRenderedHTML : [];
	},
	isHidden: function() {
		var isHidden = 'hidden';
		return isHidden;
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

		return false;
	},
	'click .icon-round': function() {
		Session.set('showGame',false);
	}
});