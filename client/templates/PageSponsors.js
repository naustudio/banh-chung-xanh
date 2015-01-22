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

			sponsorsObj[i].date = date.toLocaleDateString();

			// index
			sponsorsObj[i].index = i + 1;
		}

		return sponsorsObj;
	}
});