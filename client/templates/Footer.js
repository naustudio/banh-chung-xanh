
Template.Footer.helpers({
	newPath: function() {
		var currentURL = Router.current().url;
		// removing http://example.com/en part
		var emptyLangPath = currentURL.replace(/.*\/(en|vi).*?\/?/, '');
		return emptyLangPath;
	},

	isEnglishLanguage: function() {
		return (Session.get('language') === 'en');
	}
});

Template.Footer.events({
});