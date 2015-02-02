/* © 2014 NauStud.io
 * @author Thanh Tran
 *
 * Bootstrap the app when client start here
 */
/*global i18n*/

// default fallback language
i18n.setDefaultLanguage('vi');
// debug
i18n.showMissing(true);

// default language
Session.setDefault('language', 'vi');
Session.setDefault('map', '');

// start of steps tracker
Session.setDefault('steps', 0);


// any start up logic here
Meteor.startup(function() {
	Meteor.call('map', function(error, result) {
		Session.set('map', result);
	});
	// Settings.setItem('remainingDate', getRemainingDate());
});
