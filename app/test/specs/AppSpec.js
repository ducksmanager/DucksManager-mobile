var DEMO_USERNAME = 'demo';
var DEMO_PASSWORD;

describe('Public interface exists', function () {
    
    var notesListStorageKey = 'WhatTheDuck.CountryList';

    it('Defines the app', function () {
        expect(WhatTheDuck.app).toBeDefined();
    });

    it('Has init function', function () {
        expect(WhatTheDuck.app.init).toBeDefined();
    });

    it('Should have public interface to return country list', function () {
        expect(WhatTheDuck.app.getCountryList).toBeDefined();
    });

    it('Should return country list', function () {
        var countryList = WhatTheDuck.app.getCountryList();
        expect(countryList instanceof Array).toBeTruthy();
    });

    it('Returns a blank country', function () {
        var blankCountry = WhatTheDuck.app.createBlankCountry();
        expect(blankCountry.countrycode.length > 0).toBeTruthy();
        expect(blankCountry.countryname.length > 0).toBeTruthy();
    });

    it('Returns dummy countries saved in local storage', function () {

        WhatTheDuck.testHelper.createDummyCountries(notesListStorageKey);
        // Load dummy notes from ls.
        WhatTheDuck.app.init(notesListStorageKey);

        var countryList = WhatTheDuck.app.getCountryList();

        expect(countryList.length > 0).toBeTruthy();
    });
});

describe('Local storage can be retrieved', function() {
    it('should store credentials in the localStorage', function() {
        var testUsername = 'user' + getRandomInt(1, 2000);
        var testPassword = 'password' + getRandomInt(1, 2000);
        WhatTheDuck.app.username = testUsername;
        WhatTheDuck.app.encryptedPassword = testPassword;
        
        WhatTheDuck.app.storeCredentials();
        
        expect(localStorage.username).toEqual(testUsername);
        expect(localStorage.encryptedPassword).toEqual(testPassword);
        
    });
});

describe('Authentication works', function() {
    afterEach(function() {
        $('#error_popup').remove();
    });
    
    function waitForReturnOrFail() {
        waitsFor(function() {
            return hasRetrievedOrFailed;
        }, "The server should have been answered", 750);
    }
    
    it('Should throw an error when the security password is not provided or wrong', function() {
        
        var real_security_password = SECURITY_PASSWORD;
        SECURITY_PASSWORD = 'a fake security password';
        
        runs(function() {
            WhatTheDuck.app.getUserCollection();
        });
        
        waitForReturnOrFail();
        
        runs(function() {            
            SECURITY_PASSWORD = real_security_password;
            
            expect($('#error_popup').length).toEqual(1);
            expect($('#error_popup').find('p').text()).toEqual(i18n.t('internal_error__wrong_security_password'));
        });
    });
    
    it('Should refuse invalid credentials', function() {
       var real_demo_password = DEMO_PASSWORD;
       DEMO_PASSWORD = 'a fake user password';
       
       runs(function() {
           WhatTheDuck.app.username = DEMO_USERNAME;
           WhatTheDuck.app.encryptedPassword = CryptoJS.SHA1(DEMO_PASSWORD).toString();  
           WhatTheDuck.app.getUserCollection();
       });
       
       waitForReturnOrFail();
       
       runs(function() {            
           DEMO_PASSWORD = real_demo_password;
           
           expect($('#error_popup').length).toEqual(1);
           expect($('#error_popup').find('p').text()).toEqual(i18n.t('input_error__invalid_credentials'));
       });
    });
    
    it('Should return a valid user collection', function() {
        runs(function() {
            WhatTheDuck.app.username = DEMO_USERNAME;
            WhatTheDuck.app.encryptedPassword = CryptoJS.SHA1(DEMO_PASSWORD).toString();
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
            expect($('#error_popup').length).toEqual(0);
        });
    });
});