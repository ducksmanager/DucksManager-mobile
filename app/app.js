var WhatTheDuck = WhatTheDuck || {};
WhatTheDuck.app = (function ($) {
    
    var username;
    var password;
    var encryptedPassword;

    var countryList = [];
    var countryListStorageKey;

    function init(storageKey) {
        countryListStorageKey = storageKey,
        loadCountriesFromLocalStorage();
    }

    function getCountryList() {
        return countryList;
    }

    function loadCountriesFromLocalStorage() {
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
            countryname: 'ABC'+id
        });

        return countryModel;
    }
    
    function getUserCollection(callback) {
        retrieveOrFail('', callback);
    }
    
    function storeCredentials() {
        localStorage.username = this.username;
        localStorage.encryptedPassword = this.encryptedPassword;
    }
    
    function buildUserCollection(collection) {
        
    }
    
    function alert(title, text, directText) {
        var alertPopup = $("<div>", {id: 'error_popup'}).popup({
            theme: "b",
            overlyaTheme: "e",
            transition: "pop"
        })
        .on("popupafterclose", function () { $(this).remove(); })
        .css({padding: '5px'})
        .append($("<h2>", {'data-i18n': title}))
        .append($("<p>", directText ? {text: text} : {'data-i18n': text}))
        .i18n()
        .popup('open')
        .trigger("create");
    }

    return {
        init: init,
        getCountryList: getCountryList,
        createBlankCountry: createBlankCountry,
        getUserCollection: getUserCollection,
        storeCredentials: storeCredentials,
        buildUserCollection: buildUserCollection,
        alert: alert
    };

})(jQuery);