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

describe('Authentication works', function() {
    it('Should throw an error when the security password is not provided', function() {
        
        runs(function() {
            WhatTheDuck.app.getUserCollection();
        });
        
        waitsFor(function() {
            return hasRetrievedOrFailed;
        }, "The server should have been answered", 750);
        
        runs(function() {
            expect($('#error_popup').length).toEqual(1);
            expect($('#error_popup').find('p').text()).toEqual(i18n.t('internal_error__wrong_security_password'));
        });
    })
});