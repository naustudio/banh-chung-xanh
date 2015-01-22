/* © 2014 NauStud.io
 * @author Thanh Tran
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

		if (Session.get('show-menu')) {
			isShow = 'show';
		}
		return isShow;
	}

});

Template.Menu.events({
	'click .menu-list__close-btn': function() {
		Session.set('show-menu', false);
	},

	'click .menu-list__item': function() {
		Session.set('show-menu', false);
	}
});