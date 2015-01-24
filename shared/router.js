/* © 2014 NauStud.io
 * @author Thanh Tran
 *
 * Implement router here
 */
/*global i18n*/
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
	this.redirect('/' + getPreferredLanguage());
});

Router.route('/:lang', function() {
	if (this.params.lang === 'admin') {
		this.next();
		return;
	}
	applyLanguage(this);
	this.render('PageLanding');
	this.render(null, {to: 'intro'});
}, {
	name: 'landing'
});

Router.route('/:lang/intro', function() {
	applyLanguage(this);
	this.render('PageLanding');
	this.render('Introduction', {to: 'intro'});
}, {
	name: 'intro',
	data: function() {
		return {lang: Session.get('languge') };
	}
});

Router.route('/:lang/game/:mapId', function() {
	applyLanguage(this);
	this.render('PageGame');
}, {
	name: 'game'
});

Router.route('/:lang/sponsors', function() {
	applyLanguage(this);
	this.render('PageSponsors');
}, {
	name: 'sponsor'
});

Router.route('/:lang/players', function() {
	applyLanguage(this);
	this.render('PagePlayers');
}, {
	name: 'players'
});

Router.route('/:lang/login', function() {
	applyLanguage(this);
	this.render('FBLogin');
}, {
	name: 'login'
});

Router.route('/admin', function() {
	// no localization for admin section
	this.render('Admin');
});


function applyLanguage(route) {
	console.log('Route', route);
	var url = route.url;
	var langParam = route.params.lang || '';
	var lang = langParam.toLowerCase();

	if (lang.indexOf('vi') >= 0) {
		lang = 'vi';
	} else if (lang.indexOf('en') >= 0) {
		// default language
		lang = 'en';
	} else {
		// TODO: get default language here
		lang = getPreferredLanguage();
		// replace targetting URL with proper languge option
		url = url.replace(langParam, lang);
		console.log('new url', url);
		route.redirect(url);
	}

	if (Meteor.isClient) {
		Session.set('language', lang);
		i18n.setLanguage(lang);
	}
	return lang;
}

function getPreferredLanguage() {
	// get browser's prefered language
	// var preferredLanguage = window.navigator.userLanguage || window.navigator.language;
	// we prefer Vietnamese language for now
	var preferredLanguage = 'vi';
	console.log('preferredLanguage:', preferredLanguage);

	// normalize to get just language code
	if (preferredLanguage.indexOf('vi') >= 0) {
		preferredLanguage = 'vi';
	} else if (preferredLanguage.indexOf('en') >= 0) {
		preferredLanguage = 'en';
	} else {
		preferredLanguage = Session.get('language');
	}

	return preferredLanguage;
}

