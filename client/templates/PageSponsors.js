/* © 2014 NauStud.io
 * @author Thanh Tran
 */
/*global Sponsors*/
Template.PageSponsors.helpers({
	sponsors: function() {
		return Sponsors.find({});
	}
});