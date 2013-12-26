/* From WhatTheDuck.js */
/*global WhatTheDuck*/

WhatTheDuck.Collection = function() {
	var selectedCountry = null;
	var selectedPublication = null;
	var selectedIssue = null;
	var issues = {};

	function addCountry(country) {
		issues[country] = {};
	}

	function addPublication(country, publication) {
		if (!issues[country]) {
			addCountry(country);
		}
		issues[country][publication] = [];
	}

	function addIssueJoinedCountryAndPublication(countryAndPublication, issue) {
		var country = countryAndPublication.split('/')[0];
		addIssue(country, countryAndPublication, issue);
	}

	function addIssue(country, publication, issue) {
		if (!issues[country]) {
			addCountry(country);
		}
		if (!issues[country][publication]) {
			addPublication(country, publication);
		}
		issues[country][publication].push(issue);
	}

	function hasCountry(countryShortName) {
		return issues[countryShortName] && Object.size(issues[countryShortName]);
	}

	return {
	    selectedCountry: selectedCountry,
	    selectedPublication: selectedPublication,
	    selectedIssue: selectedIssue,
	    issues: issues,
	    
        addCountry: addCountry,
        addPublication: addPublication,
        addIssueJoinedCountryAndPublication: addIssueJoinedCountryAndPublication,
        addIssue: addIssue,
		hasCountry: hasCountry
	};
};

WhatTheDuck.Collection.CollectionType = {
	COA:  1,
	USER: 2
};

WhatTheDuck.Collection.FullNamesComparator = function(a, b) {
	return WhatTheDuck.Collection.NamesComparator(a.fullName, b.fullName);
};

WhatTheDuck.Collection.NamesComparator = function(a, b) {
	a = a.replace('* ', '');
	b = b.replace('* ', '');
	return a < b ? -1 : (a === b ? 0 : 1);
};