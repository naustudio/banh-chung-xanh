/* © 2014 NauStud.io
 * @author Thanh Tran, Trang Pham
 */
/*global Settings*/
Template.IntroDonate.helpers({
	totalAmount: function() {
		return String.addCommas(Settings.getItem('totalAmount'), '.');
	},

	remainingDate: function () {
		return Settings.getItem('remainingDate');
	},

	remainingAmount: function () {
		var remainingAmount = this.totalAmount() - Session.get('donatedAmount');
		return remainingAmount;
	},

	donatedAmount: function () {
		var amount = String.addCommas(Settings.getItem('donatedAmount'));
		amount = amount ? amount : 0;
		return amount;
	},

	percentageSponsor: function () {
		var percentageSponsor = parseInt(Settings.getItem('donatedAmount'), 10)/parseInt(Settings.getItem('totalAmount'), 10)*100;
		percentageSponsor = Math.min(percentageSponsor, 100);
		return parseInt(percentageSponsor, 10);
	}
});
