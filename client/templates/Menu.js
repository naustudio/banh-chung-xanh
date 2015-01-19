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
	}

});