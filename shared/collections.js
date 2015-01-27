/* © 2014 NauStud.io
 * @author
 */
/* global Sponsors: true, Settings:true */
// make collections here

// Players collection is now Meteor.users

// Sponsors collection
Sponsors = new Meteor.Collection('sponsors');

// Settings collection
Settings = new Meteor.Collection('settings');

Settings.getItem = function(key) {
	var item = this.findOne({key: key});
	return (item ? item.value : null);
};

Settings.setItem = function(key, value) {
	var settingItem = this.findOne({key: key});
	return this.update(settingItem._id, {key: key, value: value});
};
