/* From WhatTheDuck.js */
/*global WhatTheDuck*/

/* From i18next.js */
/*global i18n*/

var SERVER_PAGE='WhatTheDuck.php';
var DUCKSMANAGER_URL='http://www.ducksmanager.net';
var DUCKSMANAGER_PAGE_WITH_REMOTE_URL='WhatTheDuck_server.php';
var SERVER_URL;
var APPLICATION_VERSION = '2.0';
var SECURITY_PASSWORD='';
var PASSWORD_PLACEHOLDER = '******';

function onPageBeforeChange(event, data) {

    if (typeof data.toPage === 'string') {
        var url = $.mobile.path.parseUrl(data.toPage);
        if ($.mobile.path.isEmbeddedPage(url)) {
            data.options.queryString = $.mobile.path.parseUrl(url.hash.replace(/^#/, '')).search.replace('?', '');
        }
    }
}
    
function getServerURL(callback) {
    if (SERVER_URL) {
        callback(SERVER_URL);
    }
    else {
        getPage(
            DUCKSMANAGER_URL+'/'+DUCKSMANAGER_PAGE_WITH_REMOTE_URL, 
            function(response) {
                SERVER_URL = response;
                callback(SERVER_URL);
            }, 
            {},
            false
        );
    }
}

function getPage(url, callback, parameters) {
    $.ajax({
        url: url,
        type: 'get',
        data: parameters,
        success: callback,
        error: function(response) {
            alert(response.responseText);
        }
    });
}

var hasRetrievedOrFailed = true;
function retrieveOrFail(urlSuffix, callback) {
    urlSuffix = urlSuffix || {};
    if (!hasRetrievedOrFailed) {
        WhatTheDuck.app.alert('internal_error', 'Concurrent calls to retrieveOrFail detected', true);
        return;
    }
    hasRetrievedOrFailed = false;
    
    if (navigator.onLine) {
        getServerURL(function(serverURL) {
            getPage(
                serverURL+'/'+SERVER_PAGE, 
                function(response) {
                    hasRetrievedOrFailed = true;
                    response = response.replace(/\\/,'');
                    if (response === '0') {
                        WhatTheDuck.app.alert('input_error','input_error__invalid_credentials');
                        WhatTheDuck.app.user.username = '';
                    }
                    else {
                        try{
                            callback(JSON.parse(response));
                            WhatTheDuck.app.user.username = '';
                        } catch(e){
                            if (response === i18n.t('internal_error__wrong_security_password')) {
                                WhatTheDuck.app.alert('internal_error', response, true);
                            }
                            else {
                                WhatTheDuck.app.alert('internal_error', e, true);
                            }
                        }
                    }
                },
                $.extend({}, urlSuffix, {
                    pseudo_user: WhatTheDuck.app.user.username,
                    mdp_user:    WhatTheDuck.app.user.encryptedPassword,
                    mdp:         SECURITY_PASSWORD,
                    version:     APPLICATION_VERSION
                })
            );
        });
    }
    else {
        WhatTheDuck.app.alert('network_error','network_error');
    }
}

function queryStringToObject(queryString) {

    var queryStringObj = {};
    var e;
    var a = /\+/g;  // Replace + symbol with a space
    var r = /(?:\?|&)([^&;=]+)=([^&;#]*)/g;
    var d = function (s) {
        return decodeURIComponent(s.replace(a, ' '));
    };

    e = r.exec(queryString);
    while (e) {
        queryStringObj[d(e[1])] = d(e[2]);
        e = r.exec(queryString);
    }

    return queryStringObj;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}