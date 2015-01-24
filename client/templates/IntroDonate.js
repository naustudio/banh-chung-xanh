/* © 2014 NauStud.io
 * @author Thanh Tran, Trang Pham
 */
/*global Settings*/
Template.IntroDonate.helpers({
	totalAmount: function() {
		return String.addCommas(Settings.getItem('totalAmount'), '.');
	}
});