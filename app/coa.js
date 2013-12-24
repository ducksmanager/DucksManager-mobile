/* From WhatTheDuck.js */
/*global WhatTheDuck*/

var CoaListing = {
    countryNames: [],
    publicationNames: []
};

CoaListing.addCountry = function(shortName, fullName) {
    CoaListing.countryNames.push(new WhatTheDuck.Country(shortName, fullName));
};

CoaListing.addPublication = function(shortName, fullName) {
    CoaListing.publicationNames.push(new WhatTheDuck.Publication(shortName, fullName));
};