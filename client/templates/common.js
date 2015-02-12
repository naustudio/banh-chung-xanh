/*global FastClick*/
Template.ApplicationLayout.rendered = function() {
	$(document).ready(function() {

		//TODO: move this into introdonate helper
		//render progress bar sponsor in intro page

		// add FastClick
		FastClick.attach(document.body);
	});


};
