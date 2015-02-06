/* © 2014 NauStud.io
 * @author Thanh Tran, Trang Pham
 * Introduction modal
 */
/* global Modernizr */

Template.Introduction.rendered = function() {
	console.log('Introduction rendered');
	if (Modernizr.localstorage) {
		var introShowed = localStorage['introShowed'];
		if (introShowed === undefined ) {
			introShowed = false;
		}
		if (!introShowed) {
			$('.modal-introduction').modal('show');
			localStorage['introShowed'] = true;
		}
	} else {
		$('.modal-introduction').modal('show');
	}
};

Template.Introduction.events({
	'hidden.bs.modal': function() {
		console.log('Intro modal closed');
	},

	'click #intro-play-btn': function() {
		$('.modal-introduction').modal('hide');
	},

	'click .play-now': function() {
		$('.modal-introduction').modal('hide');
	}
});
