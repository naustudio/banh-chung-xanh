/* © 2014 NauStud.io
 * @author Thanh Tran
 */
/*global Sponsors, Sponsor*/
Template.Admin__Sponsors.events({
	'submit #add-sponsor-form': function(event, template) {
		var name = template.$('#sponsor-name').val();
		var amount = template.$('#sponsor-amount').val();
		var date = template.$('#sponsor-date').val();

		var sponsor = new Sponsor({
			name: name,
			amount: parseInt(amount, 10),
			date: new Date(date),
			entryDate: new Date()
		});

		Sponsors.insert(sponsor);
	}
});

Template.Admin__Sponsors.helpers({
	sponsors: function() {
		return Sponsors.find({});
	},

	totalAmount: function() {

	}
});