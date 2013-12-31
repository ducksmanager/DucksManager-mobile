/* From WhatTheDuck.js */
/*global WhatTheDuck, SECURITY_PASSWORD, PASSWORD_PLACEHOLDER*/

/* From i18next.js */
/* global i18n */

/* From common.js */
/* global queryStringToObject */

var isUserCollection = true;

WhatTheDuck.controller = (function ($, app) {

    var loginBtn = '#login';
    var signupBtn = '#end_signup';
    
    var welcomePageId = 'welcome-page';
    
    var selectors = {
        countries: {
            page: 'country-list-page',
            header: '#country-list-header',
            list: '#country-list-content',
            itemParameter: 'countryShortName',
            itemTarget: 'publications'
        },
        publications: {
            page: 'publication-list-page',
            header: '#publication-list-header',
            list: '#publication-list-content',
            itemParameter: 'publicationShortName',
            itemTarget: 'issues'
        },
        issues: {
            page: 'issue-list-page',
            header: '#issue-list-header',
            list: '#issue-list-content'
        }
    };

    var currentCountry = null;

    var publicationCountry = null;

    function init() {        
        app.init();
        $(document)
            .bind('pagechange', onPageChange)
            .bind('pagebeforechange', onPageBeforeChange)
            .on('click', loginBtn, function() {
                connectAndRetrieveList($('#username').val(), $('#password').val());
            });
    }

    function onPageChange(event, data) {
        var toPageId = data.toPage.attr('id');

        var fromPageId = null;
        if (data.options.fromPage) {
            fromPageId = data.options.fromPage.attr('id');
        }

        switch (toPageId) {
            case welcomePageId:
                loadStoredCredentials();
            break;
            
            case selectors.countries.page:
                renderCountryList();
            break;

            case selectors.publications.page:
                if (fromPageId === selectors.countries.page) {
                    renderPublicationList(data);
                }
            break;

	        case selectors.issues.page:
		        if (fromPageId === selectors.publications.page) {
			        renderIssueList(data);
		        }
		        break;
        }
    }
    
    function loadStoredCredentials() {
        if (localStorage.username && localStorage.encryptedPassword) {
            WhatTheDuck.app.user = new WhatTheDuck.User({
                username: localStorage.username,
                encryptedPassword: localStorage.encryptedPassword
            });
            $('#username').val(WhatTheDuck.app.user.username);
            $('#password')
                .val(PASSWORD_PLACEHOLDER)
                .click(function() {
                   if ($(this).val() === PASSWORD_PLACEHOLDER) {
                       $(this).val(''); 
                   }
                });
        }
    }
    
    function renderList(type, list, isUserCollection) {
        var target = selectors[type].itemTarget;
        
        var view = $(selectors[type].list);

        view.empty();

        if (list.length === 0) {
            
        }
        else {

            var itemCount = list.length;
            var item;
            var targetPageUrl;
            var label;
            var ul = $('<ul id=\'notes-list\' data-role=\'listview\'></ul>').appendTo(view);
            for (var i = 0; i < itemCount; i++) {
                item = list[i];
                switch(type) {
                    case 'countries':
                        label = app.getCountryLabel(item, isUserCollection);
                    break;
                    case 'publications':
                        label = app.getPublicationLabel(item, isUserCollection);
                    break;
	                case 'issues':
		                label = app.getIssueLabel(item, isUserCollection);
		            break;
                }

                var row = $('.row.template')
                    .clone(true)
                    .removeClass('template');
                ul.append(row);

	            if (selectors[target]) {
		            targetPageUrl = 'index.html#'+selectors[target].page+'?'+selectors[type].itemParameter+'=' + item.shortName.replace(/\//,'.');
	                row.find('a')
	                    .attr({
	                        'data-url': targetPageUrl,
	                        href: targetPageUrl
	                    });
	            }

                row.find('.label')
                    .text(label);
            }

            ul.listview();
        }
    }

    function renderCountryList() {

        var header = $(selectors.countries.header);
        if (isUserCollection) {
            header.text(i18n.t('my_collection'));
        }
        else {
            header.text(i18n.t(['insert_issue_menu', 'insert_issue__choose_country'].join(' > ')));
        }

        var countryList = app.getCountryList(WhatTheDuck.app.userCollection.issues, isUserCollection);
        renderList('countries', countryList, isUserCollection);
    }

    function renderPublicationList(data) {

        var parameters = queryStringToObject(data.options.target);
        
        var country = CoaListing.getCountry(parameters.countryShortName);
            
        var header = $(selectors.publications.header);
        if (isUserCollection) {
            header.text([i18n.t('my_collection'), country.fullName].join(' > '));
        }
        else {
            header.text([i18n.t('insert_issue_menu'), country.fullName].join(' > '));
        }

        var publicationList = app.getPublicationList(WhatTheDuck.app.userCollection.issues, country.shortName, isUserCollection);
        renderList('publications', publicationList, isUserCollection);
    }

	function renderIssueList(data) {

		var parameters = queryStringToObject(data.options.target);

		var publication = CoaListing.getPublication(parameters.publicationShortName.replace(/\./,'/'));
		var country = CoaListing.getCountry(publication.shortName.split('/')[0]);

		var header = $(selectors.issues.header);
		if (isUserCollection) {
			header.text([i18n.t('my_collection'), country.fullName, publication.fullName].join(' > '));
		}
		else {
			header.text([i18n.t('insert_issue_menu'), country.fullName, publication.fullName].join(' > '));
		}

		var issueList = app.getIssueList(WhatTheDuck.app.userCollection.issues, country.shortName, publication.shortName, isUserCollection);
		renderList('issues', issueList, isUserCollection);
	}

    return {
        init: init
    };
    
    function connectAndRetrieveList(typedUsername, typedPassword) {        
        if (!app.user
         || app.user.username !== typedUsername) {
            if (typedUsername === '' || typedPassword === '') {
                app.alert('input_error', 'input_error__empty_credentials');
                return;
            }
            else {
                app.user = new WhatTheDuck.User({
                    username: typedUsername,
                    encryptedPassword: CryptoJS.SHA1(typedPassword).toString()
                });
            }
        }
        
        app.getUserCollection(function(collection) {
            if ($('#checkBoxRememberCredentials').prop('checked')) {
                app.storeCredentials();
            }
            app.buildUserCollection(collection);
            $.mobile.changePage($('#'+selectors.countries.page));
        });
    }


})(jQuery, WhatTheDuck.app);