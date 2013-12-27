/* From WhatTheDuck.js */
/*global WhatTheDuck*/

var CoaListing = {
    countryNames: {},
    publicationNames: {}
};

CoaListing.addCountry = function(country) {
    CoaListing.countryNames[country.shortName] = new WhatTheDuck.Country(country);
};

CoaListing.addPublication = function(publication) {
    CoaListing.publicationNames[publication.shortName] = new WhatTheDuck.Publication(publication);
};

CoaListing.getCountry = function(shortName) {
	return CoaListing.countryNames[shortName];
};

CoaListing.getPublication = function(publicationShortName) {
	return CoaListing.publicationNames[publicationShortName];
};