/*global FastClick*/
Template.ApplicationLayout.rendered = function() {
	$(document).ready(function() {

		//TODO: move this into introdonate helper
		//render progress bar sponsor in intro page
		var percentageSponsor;
		var currentSponsor = $('#currentSponsor').text();
		var totalSponsor = $('#totalSponsor').text();
		percentageSponsor = parseInt(currentSponsor, 10)/parseInt(totalSponsor, 10)*100;
		$('#percentageSponsor').text(percentageSponsor);
		var progressCurrent = percentageSponsor/100 * parseInt($('.progress').width(),10);
		$('.progress-current').width(progressCurrent);

		// add FastClick
		FastClick.attach(document.body);
	});
};
