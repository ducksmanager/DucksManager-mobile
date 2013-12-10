WhatTheDuck.testHelper = (function () {

    function createDummyCountries(countryListStorageKey) {

        var countryCount = 10;
        var countries = [];

        for (var i = 0; i < countryCount; i++) {
            var country = WhatTheDuck.app.createBlankCountry();
            countries.push(country);
        }
        $.jStorage.set(countryListStorageKey, countries);
    }

    return {
        createDummyCountries: createDummyCountries
    };

})();