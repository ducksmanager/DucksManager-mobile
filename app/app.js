/* From common.js */
/*global getRandomInt, retrieveOrFail*/

/* From coa.js */
/*global CoaListing*/

var WhatTheDuck = WhatTheDuck || {};
WhatTheDuck.app = (function ($) {
    
    var user;
    var userCollection;
    var coaCollection;

    var countryList = [];
    var countryListStorageKey;

    function init(storageKey) {
        countryListStorageKey = storageKey,
        loadCountriesFromLocalStorage();
        
        this.userCollection = new WhatTheDuck.Collection();
        this.coaCollection = new WhatTheDuck.Collection();
    }

    function getCountryList() {
        return countryList;
    }
	
	function setUser(newUser) {
		this.user = newUser;
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
        localStorage.username = this.user.username;
        localStorage.encryptedPassword = this.user.encryptedPassword;
    }
    
    function buildUserCollection(collection) {
        var issues = collection.numeros;
        $.each(issues, function(countryAndPublication, publicationIssues) {
            $.each(publicationIssues, function() {
                WhatTheDuck.app.userCollection.addIssueJoinedCountryAndPublication(
                    countryAndPublication, 
                    new WhatTheDuck.Issue(this.Numero, true, this.Etat)
                );
            });
        });
        
        var inducksInfo = collection.static;
        $.each(inducksInfo.pays, CoaListing.addCountry);
        $.each(inducksInfo.magazines, CoaListing.addPublication);
    }
    
    function alert(title, text, directText) {
        $("<div>", {id: 'error_popup'}).popup({
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
		user: user,
		userCollection: userCollection,
		coaCollection: coaCollection,
		
		setUser: setUser,
        init: init,
        getCountryList: getCountryList,
        createBlankCountry: createBlankCountry,
        getUserCollection: getUserCollection,
        storeCredentials: storeCredentials,
        buildUserCollection: buildUserCollection,
        alert: alert
    };

})(jQuery);