/* © 2014 NauStud.io
 * @author Thanh Tran
 */
// Implement router here
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
	this.render('PageGame');
});

Router.route('/intro', function() {
	this.render('PageGame');
	this.render('Intro', {to: 'intro'});
});

Router.route('/sponsors', function() {
	this.render('PageSponsors');
});

Router.route('/players', function() {
	this.render('PagePlayers');
});

Router.route('/admin', function() {
	this.render('Admin');
});

