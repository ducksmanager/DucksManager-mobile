/* From WhatTheDuck.js */
/*global WhatTheDuck*/

WhatTheDuck.Collection = function() {
	var selectedCountry = null;
	var selectedPublication = null;
	var selectedIssue = null;
	var issues = [];
	
	function addCountry(country) {
		this.issues[country] = [];
	}
	
	function addPublication(country, publication) {
		if (!this.issues[country]) {
			this.addCountry(country);
		}
		this.issues[country][publication] = [];
	}
	
	function addIssueJoinedCountryAndPublication(countryAndPublication, issue) {
		var country = countryAndPublication.split('/')[0];
		this.addIssue(country, countryAndPublication, issue);
	}
	
	function addIssue(country, publication, issue) {
		if (!this.issues[country]) {
			this.addCountry(country);
		}
		if (!this.issues[country][publication]) {
			this.addPublication(country, publication);
		}
		$.extend(this.issues[country][publication], issue);
	}
	
	function getCountryList(type) {
		var countryList = [];
		var countrySet = $.map(this.issues, function(element,index) {
			return index;
		});
		
		$.each(countrySet, function() {
			countryList.push((
                WhatTheDuck.Collection.CollectionType.COA === type && 
                WhatTheDuck.app.userCollection.hasCountry(this)
					? '*'
					: '')
				+ CoaListing.getCountryFullName(this));
		});
		
		return countryList.sort(WhatTheDuck.Collection.NamesComparator);
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
        getCountryList: getCountryList
	};
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