/* © 2014 NauStud.io
 * @author Thanh Tran
 *
 * Default / initial configuration
 */
/*global i18n*/

Meteor.startup(function() {
	i18n.setDefaultLanguage('en');

	//need to check user's locale
	i18n.setLanguage('vi');
	//debug
	i18n.showMissing(true);

});
