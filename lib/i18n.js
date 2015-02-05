/*
	Original package:
	just-i18n package for Meteor.js
	author: Hubert OG <hubert@orlikarnia.com>
*/
/**
 * @author: Thanh Tran
 * Change list:
 * + Update reference of the default template package from UI to Blaze
 * + Change template helper from 'i18n' to 't' for more convenient coding
 * + Add 'lc' helper to generate the language code to the template (useful for html attributes and hyperlinks)
 */
// jshint curly:false
// jscs:disable requireCurlyBraces
/*global i18n:true, Handlebars*/
var maps            = {};
var language        = '';
var defaultLanguage = 'en';
var missingTemplate = '';
var showMissing     = false;
var dep             = new Deps.Dependency();


/*
	Convert key to internationalized version
*/
i18n = function() {
	dep.depend();

	var label;
	var args = _.toArray(arguments);

	/* remove extra parameter added by blaze */
	if (typeof args[args.length-1] === 'object') {
		args.pop();
	}

	label = args[0];
	args.shift();


	if (typeof label !== 'string') return '';
	var str = (maps[language] && maps[language][label]) ||
				(maps[defaultLanguage] && maps[defaultLanguage][label]) ||
				(showMissing && _.template(missingTemplate, {language: language, defaultLanguage: defaultLanguage, label: label})) ||
				'';
	str = replaceWithParams(str, args);
	return str;
};

/*
	Register handlebars helper
*/
if (Meteor.isClient) {
	if (Blaze) {
		Blaze.registerHelper('t', function() {
			return i18n.apply(this, arguments);
		});
		Blaze.registerHelper('lc', function() {
			return i18n.getLanguage() || defaultLanguage;
		});
	} else if (Handlebars) {
		Handlebars.registerHelper('t', function() {
			return i18n.apply(this, arguments);
		});
		Handlebars.registerHelper('lc', function() {
			return i18n.getLanguage() || defaultLanguage;
		});
	}
}

function replaceWithParams(string, params) {
	var formatted = string;
	params.forEach(function(param , index) {
		var pos = index + 1;
		formatted = formatted.replace('{$' + pos + '}', param);
	});

	return formatted;
}

/*
	Settings
*/
i18n.setLanguage = function(lng) {
	language = lng;
	dep.changed();
};

i18n.setDefaultLanguage = function(lng) {
	defaultLanguage = lng;
	dep.changed();
};

i18n.getLanguage = function() {
	dep.depend();
	return language;
};

i18n.showMissing = function(template) {
	if (template) {
		if (typeof template === 'string') {
			missingTemplate = template;
		} else {
			missingTemplate = '[<%= label %>]';
		}
		showMissing = true;
	} else {
		missingTemplate = '';
		showMissing = false;
	}
};

/*
	Register map
*/
i18n.map = function(language, map) {
	if (!maps[language]) maps[language] = {};
	registerMap(language, '', false, map);
	dep.changed();
};

var registerMap = function(language, prefix, dot, map) {
	if (typeof map === 'string') {
		maps[language][prefix] = map;
	} else if (typeof map === 'object') {
		if (dot) prefix = prefix + '.';
		_.each(map, function(value, key) {
			registerMap(language, prefix + key, true, value);
		});
	}
};
