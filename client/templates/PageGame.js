Template.PageGame.rendered = function() {

};

Template.PageGame.helpers({
	mapData: function() {
		console.log(Session.get('map'));
		return Session.get('map');
	}
});

Template.PageGame.events({

});