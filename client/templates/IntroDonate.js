/* © 2014 NauStud.io
 * @author Thanh Tran, Trang Pham
 */
/*global Settings*/
Template.IntroDonate.rendered = function() {
	// Meteor.call('updateDonationTotal');
	/*setInterval(function() {

	},1000);*/
};
Template.IntroDonate.helpers({
	currentScore: function() {
		let amount = 0;

		if (Meteor.userId()) {
			amount = Meteor.users.getTotalScore(Meteor.userId());
		}

		return amount;
	},
});
