/* From common.js */
/*global getRandomInt, retrieveOrFail*/

/* From coa.js */
/*global CoaListing*/

var WhatTheDuck = WhatTheDuck || {};
WhatTheDuck.app = (function ($) {
    
    var user = null;
    var userCollection = null;

    function init() {
        this.userCollection = new WhatTheDuck.Collection();
    }

	function getCountryList(issues, isUserCollection) {
		var countryList = [];
		return $.map(issues, function(element,index) {
			return CoaListing.getCountryFullName(index);
		})
			.sort(WhatTheDuck.Collection.FullNamesComparator);
	}
	
	function setUser(newUser) {
		this.user = newUser;
	}

    function createBlankCountry() {

        var dateCreated = new Date();
        var id = '' + dateCreated.getTime() + getRandomInt(0, 100);
        return new WhatTheDuck.Country({
            shortName: id,
            fullName: 'ABC'+id
        });
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
                    new WhatTheDuck.Issue({
	                    issueNumber: this.Numero,
	                    inCollection: true,
	                    issueCondition: this.Etat
                    })
                );
            });
        });
        
        var inducksInfo = collection.static;
        $.each(inducksInfo.pays, function(shortName, fullName) {
	        CoaListing.addCountry({shortName: shortName, fullName: fullName});
        });
        $.each(inducksInfo.magazines, function(shortName, fullName) {
	        CoaListing.addPublication({shortName: shortName, fullName: fullName});
        });
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