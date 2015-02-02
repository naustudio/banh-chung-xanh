
Template.GameGuide.events({
	'click .gameguide__next': function() {
		Session.set('show-menu', !Session.get('show-menu'));
	},

	'click a.control_prev': function () {
			$('#slider ul').animate({
			left: 500
			}, 200, function () {
		$('#slider ul li:last-child').prependTo('#slider ul');
			$('#slider ul').css('left', '');
		});
		console.log($('#slider ul li:last-child').height());
		var newHeight = $('#slider ul li:last-child').height();
		$('#slider').height(newHeight);

	},

	'click a.control_next': function () {
		$('#slider ul').animate({
			left: - 500//slideWidth
			}, 200, function () {
		$('#slider ul li:first-child').appendTo('#slider ul');
			$('#slider ul').css('left', '');
		});
		var newHeight = $('#slider ul li:first-child').height();
		$('#slider').height(newHeight);
	}

});

Template.GameGuide.helpers({

	heightSlider: function() {
		var newHeight = $('#slider ul li:first-child').height();
		$('#slider').height(newHeight);
		return newHeight?newHeight:'500px';
	}
});