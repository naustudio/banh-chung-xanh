/* © 2014 NauStud.io
 * @author Thanh Tran
 *
 * Bootstrap the app when client start here
 */
/*global i18n*/

// default fallback language
i18n.setDefaultLanguage('vi');
i18n.setLanguage('vi');
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
	Meteor.subscribe('userData');

	// SEO
	SEO.config({
		title: 'Bánh Chưng Xanh - Nâu Studio',
		meta: {
			'description': i18n('meta-description')
		},
		og: {
			'image': [
				'http://banhchungxanh.naustud.io/img/logo.png',
				'http://banhchungxanh.naustud.io/img/characters2x/main-character.png',
				'http://banhchungxanh.naustud.io/img/characters2x/banh-chung.png',
				'http://banhchungxanh.naustud.io/img/characters2x/decorator-1.png'
			]
		},
		twitter: {
			'site': '@naustudio',
			'image': 'http://banhchungxanh.naustud.io/img/logo.png'
		},
		rel_author: 'https://plus.google.com/+NauStudio'
	});

});
