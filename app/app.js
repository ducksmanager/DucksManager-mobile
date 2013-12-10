var WhatTheDuck = WhatTheDuck || {};
WhatTheDuck.app = (function ($) {

    var countryList = [];
    var countryListStorageKey;

    function init(storageKey) {
        countryListStorageKey = storageKey,
        loadNotesFromLocalStorage();
    }

    function getCountryList() {
        return countryList;
    }

    function loadNotesFromLocalStorage() {
        var storedCountries = $.jStorage.get(countryListStorageKey);

        if (storedCountries !== null) {
            countryList = storedCountries;
        }
    }

    function createBlankCountry() {

        var dateCreated = new Date();
        var id = new String(dateCreated.getTime()) + new String(getRandomInt(0, 100));
        var countryModel = new WhatTheDuck.Country({
            countrycode: id,
            countryname: "ABC"+id
        });

        return countryModel;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        init: init,
        getCountryList: getCountryList,
        createBlankCountry: createBlankCountry
    };

})(jQuery);