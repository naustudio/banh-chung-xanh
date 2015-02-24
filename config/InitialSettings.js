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
			//the total amount we can donate
			key: 'totalAmount',
			value: 30000000
		},
		{
			// end of campaign date to show the count down
			key: 'endDate',
			// note: it's GMT time
			value: new Date('2015-02-24T7:00:00.000Z')
		},
		{
			// amount for solving easy map
			key: 'levelEasyAmount',
			// VND
			value: 10000
		},
		{
			// amount for solving medium map
			key: 'levelMediumAmount',
			// VND
			value: 15000
		},
		{
			// amount for solving hard map
			key: 'levelHardAmount',
			// VND
			value: 20000
		},
		{
			// amount we'll pledge to donate, after calculating the maps solved by our players
			// keeping here for caching purpose
			key: 'donatedAmount',
			// VND
			value: 0
		},
		{
			// amount we'll pledge to donate, after calculating the maps solved by our players
			// keeping here for caching purpose
			key: 'remainingDate',
			// VND
			value: 0
		}
	];
}