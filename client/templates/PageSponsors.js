/* © 2014 NauStud.io
 * @author Thanh Tran
 */
/*global Sponsors*/
Template.PageSponsors.helpers({
	sponsors: function() {
		//var sponsors = Sponsors.find();

		// re-format date
		var sponsorsObj = Sponsors.find().fetch();
		var date = new Date();

		for (var i = 0; i < sponsorsObj.length; i++) {
			var ObjDate = sponsorsObj[i].date;

			if (ObjDate) {
				var newObjDate = new Date(ObjDate);
				sponsorsObj[i].date = newObjDate.toLocaleDateString();
			}
			else {
				sponsorsObj[i].date = date.toLocaleDateString();
			}

			// index
			sponsorsObj[i].index = i + 1;
		}

		return sponsorsObj;
	}
});