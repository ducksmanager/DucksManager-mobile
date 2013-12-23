/* From WhatTheDuck.js */
/*global WhatTheDuck*/

WhatTheDuck.Collection = function() {
	this.selectedCountry = null;
	this.selectedPublication = null;
	this.selectedIssue = null;
	this.issues = [];
};

WhatTheDuck.Collection.CollectionType = {
	COA:  1,
	USER: 2
};

WhatTheDuck.Collection.NamesComparator = function(a, b) {
	a = a.replace('* ', '');
	b = b.replace('* ', '');
	return a < b ? -1 : (a === b ? 0 : 1);
};