/* From common.js */
/*global getRandomInt, retrieveOrFail, queryStringToObject, SECURITY_PASSWORD, DEMO_PASSWORD*/

/* From coa.js */
/*global CoaListing*/

var WhatTheDuck = WhatTheDuck || {};
WhatTheDuck.app = (function ($) {
    
    var user = null;
    var userCollection = null;
    
    // Fetches the passwords from the URL's parameters if provided
    function processParameters() {
        var parameters = queryStringToObject(document.URL);
        
        if (parameters.security) {
            SECURITY_PASSWORD = parameters.security;
        }
        if (parameters.demo_password) {
            DEMO_PASSWORD = parameters.demo_password;
        }
    }
    
    function init() {
        this.userCollection = new WhatTheDuck.Collection();
    }
    
    function getCountryLabel(country, isUserCollection) {
        return (!isUserCollection && WhatTheDuck.app.userCollection.hasCountry(country.shortName)
                ? '* '
                : '')
            + country.fullName;
    }
    
    function getPublicationLabel(publication, isUserCollection) {
        return (!isUserCollection && WhatTheDuck.app.userCollection.hasPublication(publication.shortName)
                ? '* '
                : '')
            + publication.fullName;
    }

	function getIssueLabel(currentPublication, issue, isUserCollection) {
		return (!isUserCollection && WhatTheDuck.app.userCollection.getIssue(currentPublication.shortName, issue.issueNumber)
			? '* '
			: '')
			+ issue.issueNumber;
	}

	function getIssueConditionClass(currentPublication, issue) {
		return WhatTheDuck.app.userCollection.getIssue(currentPublication.shortName, issue.issueNumber)
			? ($.map(WhatTheDuck.Issue.IssueCondition, function(dbLabel, cssClassName) {
				if (dbLabel === issue.issueCondition) {
					return cssClassName;
				}
				return undefined;
			  })[0].toLowerCase())
			: 'no_condition';
	}

    function getCountryList(issues) {
        return $.map(issues, function(publications, shortName) {
            return CoaListing.getCountry(shortName);
        })
            .sort(WhatTheDuck.Collection.FullNamesComparator);
    }

    function getPublicationList(issues, country) {
        return $.map(issues[country], function(element,shortName) {
            return CoaListing.getPublication(shortName);
        })
            .sort(WhatTheDuck.Collection.FullNamesComparator);
    }

	function getIssueList(issues, country, publication) {
		return issues[country][publication]
			.sort(WhatTheDuck.Collection.IssueComparator);
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
    
    processParameters();

    return {
        user: user,
        userCollection: userCollection,
        
        setUser: setUser,
        init: init,
        getCountryLabel: getCountryLabel,
        getPublicationLabel: getPublicationLabel,
	    getIssueLabel: getIssueLabel,
	    getIssueConditionClass: getIssueConditionClass,
        getCountryList: getCountryList,
        getPublicationList: getPublicationList,
	    getIssueList: getIssueList,
        createBlankCountry: createBlankCountry,
        getUserCollection: getUserCollection,
        storeCredentials: storeCredentials,
        buildUserCollection: buildUserCollection,
        alert: alert
    };

})(jQuery);