/* From WhatTheDuck.js */
/*global WhatTheDuck, SECURITY_PASSWORD*/

/* From common.js */
/*global getRandomInt*/


var DEMO_USERNAME = 'demo';
var DEMO_PASSWORD;

var onlineCollection;
var countries;
var publications;

function waitForReturnOrFail() {
	waitsFor(function() {
		return hasRetrievedOrFailed;
	}, 'The server should have been answered', 1000);
}

function initCollection() {
	WhatTheDuck.app.setUser(new WhatTheDuck.User({
		username: DEMO_USERNAME,
		encryptedPassword: CryptoJS.SHA1(DEMO_PASSWORD).toString()
	}));

	WhatTheDuck.app.userCollection = new WhatTheDuck.Collection();

	onlineCollection = {
		'es/BCB':[
			{Numero:'1', Etat:'bon'}
		],
		'fr/CB':[
			{Numero:'P 88', Etat:'bon'}
		],
		'fr/DDD':[
			{Numero: '1', Etat:'bon'},
			{Numero: '2', Etat:'bon'}
		]
	};

	countries = {
		'es': 'Espagne',
		'fr': 'France'
	};

	publications = {
		'es/BCB':'Biblioteca Carl Barks',
		'fr/CB':'Collection Biblioth\u00e8que',
		'fr/DDD':'La dynastie Donald Duck - Int\u00e9grale Carl Barks'
	};
}

beforeEach(function() {
  this.addMatchers({
		toBeANullErrorPopup: function() {
			this.message = function() {
				return 'Expected no error popup but saw one with '+$('#error_popup').find('p').text();
			};

			return this.actual.length === 0;
		},
		
		toBeAnErrorPopupWithMessage: function(errorText) {
			this.message = function() {
				if (this.actual.length === 0) {
					return 'Expected an error popup with message '+errorText+' but got none';
				}
				return 'Expected an error popup with message '+errorText+' but got '+this.actual.find('p').text();
			};

			return this.actual.length === 1 && this.actual.find('p').text() === errorText;
		}
	});
});

describe('Public interface exists', function () {

    it('Defines the app', function () {
        expect(WhatTheDuck.app).toBeDefined();
    });

    it('Has init function', function () {
        expect(WhatTheDuck.app.init).toBeDefined();
    });

    it('Should return country list', function () {
	    WhatTheDuck.app.userCollection = new WhatTheDuck.Collection();
	    WhatTheDuck.app.userCollection.addIssue('fr','fr/DDD', new WhatTheDuck.Issue({
		    issueNumber: '1',
		    inCollection: true,
		    issueCondition: null
	    }));

        var countryList = WhatTheDuck.app.getCountryList(WhatTheDuck.app.userCollection, true);
        expect(countryList instanceof Array).toBeTruthy();
    });

    it('Returns a blank country', function () {
        var blankCountry = WhatTheDuck.app.createBlankCountry();
        expect(blankCountry.shortName.length > 0).toBeTruthy();
        expect(blankCountry.fullName.length > 0).toBeTruthy();
    });
});

describe('Local storage can be retrieved', function() {
    it('should store credentials in the localStorage', function() {
        var testUsername = 'user' + getRandomInt(1, 2000);
        var testPassword = 'password' + getRandomInt(1, 2000);
        WhatTheDuck.app.user = new WhatTheDuck.User({
            username: testUsername,
            encryptedPassword: testPassword
        });
        
        WhatTheDuck.app.storeCredentials();
        
        expect(localStorage.username).toEqual(testUsername);
        expect(localStorage.encryptedPassword).toEqual(testPassword);
        
    });
});

describe('Authentication works', function() {

    beforeEach(function() {
        WhatTheDuck.app.setUser(new WhatTheDuck.User({
            username: DEMO_USERNAME,
            encryptedPassword: CryptoJS.SHA1(DEMO_PASSWORD).toString()
        }));
    });

    afterEach(function() {
        $('#error_popup').remove();
    });
    
    it('Should throw an error when the security password is not provided or wrong', function() {
        
        var real_security_password = SECURITY_PASSWORD;
        SECURITY_PASSWORD = 'a fake security password';
        
        runs(function() {
            WhatTheDuck.app.getUserCollection();
        });
        
        waitForReturnOrFail();
        
        runs(function() {            
            SECURITY_PASSWORD = real_security_password;
            
            expect($('#error_popup')).toBeAnErrorPopupWithMessage(i18n.t('internal_error__wrong_security_password'));
        });
    });
    
    it('Should refuse invalid credentials', function() {
       
       runs(function() {
			WhatTheDuck.app.setUser({
				username: DEMO_USERNAME,
				encryptedPassword: CryptoJS.SHA1('a fake user password').toString()
			});
			WhatTheDuck.app.getUserCollection();
       });
       
       waitForReturnOrFail();
       
       runs(function() {
           expect($('#error_popup')).toBeAnErrorPopupWithMessage(i18n.t('input_error__invalid_credentials'));
       });
    });
    
    it('Should return a valid user collection', function() {
        runs(function() {
            WhatTheDuck.app.getUserCollection(function(collection) {
                expect(collection).toBeDefined();
                expect(collection['numeros']).toBeDefined();
                expect(collection['static']).toBeDefined();
                expect(typeof collection['numeros']).toEqual('object');
                expect(typeof collection['static']).toEqual('object');
            });
        });
		
		waitForReturnOrFail();
        
        runs(function() {
            expect($('#error_popup')).toBeANullErrorPopup();
        });
    });
});

describe('Collection handling', function() {

	beforeEach(initCollection);

	it('should throw an error if the collection is malformed', function() {
		runs(function() {
			handleRetrievedCollection('{a:b');
		});

		waitForReturnOrFail();

		runs(function() {
			expect($('#error_popup')).toBeAnErrorPopupWithMessage(i18n.t('internal_error__malformed_list'));
		});
	});

    it('should sort the issues correctly', function() {
        var list = ['2', 'A', '* 3', '1'];
        var sortedList = list.sort(WhatTheDuck.Collection.NamesComparator);
        
        expect(sortedList).toEqual(['1', '2', '* 3', 'A']);
    });
    
    it('should add issues from the online collection to the local one', function() {
        WhatTheDuck.app.buildUserCollection({
            numeros: onlineCollection, 
            static: {pays: countries, magazines: publications}
        });
        
        expect(Object.size(WhatTheDuck.app.userCollection.issues)).toEqual(Object.size(countries));
	    var actualPublicationNumber = 0;
	    $.each(WhatTheDuck.app.userCollection.issues, function() {
		    actualPublicationNumber += Object.size(this);
	    });
	    expect(actualPublicationNumber).toEqual(Object.size(publications));
    });
});

describe('COA listing', function() {

	it('should get the user collecion\'s country list', function() {
		var countryFullName = CoaListing.getCountryFullName('fr');
		expect(countryFullName.fullName).toEqual(countries.fr);
	});
});