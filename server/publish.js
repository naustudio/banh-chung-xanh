/*global Sponsors, Settings*/
// implement collection publish here, below is example from todos app

// Meteor.publish('publicLists', function() {
//   return Lists.find({userId: {$exists: false}});
// });

// Meteor.publish('privateLists', function() {
//   if (this.userId) {
//     return Lists.find({userId: this.userId});
//   } else {
//     this.ready();
//   }
// });

// Meteor.publish('todos', function(listId) {
//   check(listId, String);

//   return Todos.find({listId: listId});
// });

Meteor.publish('userData', function() {
	// if (this.userId) {
	return Meteor.users.find(
		{},
		{
			fields: {
				gameScores: 1,
				lastAccess: 1,
				username: 1,
				services: 1,
				profile: 1,
			},
		}
	);
	// } else {
	// 	this.ready();
	// }
});

Meteor.publish('sponsors', function() {
	return Sponsors.find(
		{},
		{
			fields: {
				name: 1,
				amount: 1,
				date: 1,
				entryDate: 1,
			},
		}
	);
});
