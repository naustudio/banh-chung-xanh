/* © 2014 NauStud.io
 * @author Thanh Tran
 */

Template.IntroBlockControl.helpers({
	mapNumber: function() {
		return Router.current().params.mapId;
	},

	userSteps: function() {
		return Session.get('steps');
	}
});