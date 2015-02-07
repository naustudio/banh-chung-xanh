/* © 2014 NauStud.io
 * @author Thanh Tran
 *
 * Implement router here
 */
/*jshint multistr:true*/
/*global i18n, ga*/

Router.configure({
	layoutTemplate: 'ApplicationLayout',
	onAfterAction: function() {
		if (Meteor.isClient) {
			// use this hook to track page view
			ga('send', 'pageview', this.url);
		}
	}
});

var checkIntro = function() {
	this.render('Introduction', {
		to: 'intro'
	});
};

Router.route('/', function() {
	this.redirect('/' + getPreferredLanguage() ); //+ '/intro');
});

Router.route('/:lang', function() {
	if (this.params.lang === 'admin') {
		this.next();
		return;
	}
	applyLanguage(this);
	this.render('PageLanding');
	checkIntro.call(this);
}, {
	name: 'landing'
});

Router.route('/:lang/game/:mapId', function() {
	applyLanguage(this);
	this.render('PageGame');
	checkIntro.call(this);
}, {
	name: 'game',
	data: function() {
		return {lang: Session.get('languge') };
	}
});

Router.route('/:lang/sponsors', function() {
	applyLanguage(this);
	this.render('PageSponsors');
	checkIntro.call(this);
}, {
	name: 'sponsor'
});

Router.route('/:lang/players', function() {
	applyLanguage(this);
	this.render('PagePlayers');
	checkIntro.call(this);
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
	// console.log('Route', route);
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
		return;
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

/**
 * Dynamic metadata for social network and SEO
 */
/*global Package, WebApp*/
if (Meteor.isServer) {
	var handleServeRoute = function(lang, mapId) {
		// console.log('dynamic head:', req.url);
		// meta data
		lang = lang || 'vi';
		i18n.setLanguage(lang);

		var title = i18n('bcx') + ' - Nau Studio';
		if (mapId) {
			title = i18n('round') + ' ' + mapId + ' - ' + title;
		}

		Inject.rawHead('title',
			'<title>' + title + '</title>\
			<meta property="og:title" content="' + title + '" />\
			<meta name="twitter:title" content="' + title + '">'
		);

		var metaDescription = i18n('meta-description');

		Inject.rawHead('metaDesc',
			'<meta name="description" content="' + metaDescription + '>\
			<meta property="og:description" content="' + metaDescription + '" />\
			<meta name="twitter:description" content="' + metaDescription + '">'
		);


	};

	// per-resquest handler for inject-initial plugin
	// https://github.com/meteorhacks/meteor-inject-initial
	if (!Package.appcache) {
		var rAppPath = /(\/vi|\/en)(?:\/map)?(\/\d+)?/;
		WebApp.connectHandlers.use(function(req, res, next) {
			if (Inject.appUrl(req.url)) {
				var url = req.url;
				var matches = url.match(rAppPath);

				if (url === '/' || matches) {
					var lang = matches && matches[1] && matches[1].substr(1);
					var mapId = matches && matches[2] && matches[2].substr(1);
					handleServeRoute(lang, mapId);
				}

			}
			next();
		});
	}

}

