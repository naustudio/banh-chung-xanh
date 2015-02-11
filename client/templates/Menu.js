/* © 2014 NauStud.io
 * @author Thanh Tran, Thang Kieu
 *
 * Menu template
 */

Template.Menu.helpers({
	currentPath: function() {
		var currentURL = Router.current().url;
		// removing http://example.com/en part
		var emptyLangPath = currentURL.replace(/.*\/(en|vi).*?\/?/, '');
		return emptyLangPath;
	},

	isEnglishLanguage: function() {
		return (Session.get('language') === 'en');
	},

	isShow: function() {
		var isShow = '';

		var $menuWrap = $('.menu-list-wrap');

		if (Session.get('show-menu')) {
			isShow = 'show';


			$menuWrap
				.eq(0).fadeIn(300)
				.on('touchmove', function(e) {
					e.preventDefault();
				});
		} else {
			$('.menu-list-wrap').eq(0).fadeOut(300);
		}

		return isShow;
	}

});

Template.Menu.events({
	'click .menu-list__close-btn': function() {
		event.preventDefault();
		event.stopPropagation();

		Session.set('show-menu', false);
	},

	'click .menu-list__item': function() {
		Session.set('show-menu', false);
	},

	'click .button-modal-guide': function() {
		$('.modal-game-guide').modal('show');
	},
	'click .intro-popup': function() {
		$('.modal-introduction').modal('show');
	}
});
