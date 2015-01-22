/* © 2014 NauStud.io
 * @author Thanh Tran
 */
/*global Sponsors*/
Template.PageSponsors.helpers({
	sponsors: function() {
		var sponsors = Sponsors.find({});

		// re-format date
		var sponsorsObj = sponsors.fetch();
		var date = null;

		for (var i = 0; i < sponsorsObj.length; i++) {
			date = sponsorsObj[i].date;

			date = date.toLocaleDateString();

			sponsorsObj[i].date = date;
		}

		return sponsorsObj;
	}
});