/**
 * Polyfill and prototype augmentation
 */

/*
 * Add Commas to numbers
 * @method
 * @param	{*} nStr			Number/String to add comma
 * @param	{String} sep Custom separator in place of the comma
 * @return {String}	The commas-added string
 * @static
 * @author	unknown
 */
String.addCommas = function(nStr, sep) {
	if (nStr === undefined || nStr === null) { return ''; }
	if (!sep) { sep = ','; }
	var parts = nStr.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
	return parts.join('.');
};