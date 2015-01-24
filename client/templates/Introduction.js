/* © 2014 NauStud.io
 * @author Thanh Tran, Trang Pham
 * Introduction modal
 */

Template.Introduction.rendered = function() {
	console.log('Introduction rendered');
	$('.modal-introduction').modal('show');
};

Template.Introduction.events({
	'hidden.bs.modal': function() {
		console.log('Intro modal closed');
		Router.current().redirect('/' + Session.get('language'));
	},

	'click #intro-play-btn': function() {
		$('.modal-introduction').modal('hide');
	}
});
