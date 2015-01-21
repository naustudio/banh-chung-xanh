/* © 2014 NauStud.io
 * @author Thanh Tran
 *
 * Bootstrap the app when client start here
 */
/*global i18n*/

// default fallback language
i18n.setDefaultLanguage('en');
// debug
i18n.showMissing(true);

// default language
Session.set('language', 'vi');
Session.set('map', '');


// any start up logic here
Meteor.startup(function() {
	Meteor.call('map', function(error, result) {
		Session.set('map', result);
	});
});
