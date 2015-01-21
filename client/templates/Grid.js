Template.gridMap.rendered = function() {

};

Template.gridMap.helpers({
	squares: function() {
		var squares = [];
		for (var i = 0; i < window.gridView.length; i++) {
			for (var j = 0; j < window.gridView.length; j++) {
				squares.push(window.gridView[i][j]);
			}
			window.gridView[i]
		}
		return squares;
	}
});

Template.gridMap.events({

});