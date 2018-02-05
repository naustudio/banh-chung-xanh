/* © 2014 NauStud.io
 * @author Thanh Tran
 */
/*global InitialSettings: true*/
if (Meteor.server) {
	/**
	 * These settings will be used to initialized the Settings collection
	 * App settings will editable via admin interface
	 * @type {Array}
	 */
	InitialSettings = [
		{
			// amount for solving easy map
			key: 'levelEasyAmount',
			// VND
			value: 10,
		},
		{
			// amount for solving medium map
			key: 'levelMediumAmount',
			// VND
			value: 20,
		},
		{
			// amount for solving hard map
			key: 'levelHardAmount',
			// VND
			value: 50,
		},
	];
}
