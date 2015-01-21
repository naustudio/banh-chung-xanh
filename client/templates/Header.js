/**
 * @NauStudio
 * Thang Kieu
 */
Template.Header.helpers({
	menu: function() {

	}
});

Template.Header.events({
	'click .header__menu-btn': function() {
		Session.set('show-menu', true);
	}
});