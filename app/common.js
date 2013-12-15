var SERVER_PAGE='WhatTheDuck.php';
var DUCKSMANAGER_URL='http://www.ducksmanager.net';
var DUCKSMANAGER_PAGE_WITH_REMOTE_URL='WhatTheDuck_server.php';
var SERVER_URL;
var APPLICATION_VERSION = '2.0';
var SECURITY_PASSWORD='';

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
        type: 'post',
        data: parameters,
        success: callback,
        error: function(response) {
            alert(response.responseText);
        }
    });
}

function retrieveOrFail(urlSuffix, callback) {
    urlSuffix = urlSuffix || {};
    
    if (navigator.onLine) {
        if (!WhatTheDuck.app.encryptedPassword) {
            WhatTheDuck.app.encryptedPassword = CryptoJS.SHA1(WhatTheDuck.app.password).toString(CryptoJS.enc.Latin1);
        }
        getServerURL(function(serverURL) {
            getPage(
                serverURL+'/'+SERVER_PAGE, 
                function(response) {
                    response = response.replace(/\\/,'');
                    if (response === '0') {
                        WhatTheDuck.app.alert('input_error','input_error__invalid_credentials');
                        WhatTheDuck.app.username = '';
                        WhatTheDuck.app.password = '';
                    }
                    else {
                        try{
                            callback(JSON.parse(response));
                        } catch(e){
                            WhatTheDuck.app.alert('internal_error', e, true);
                        }
                    }
                },
                $.extend(urlSuffix, {
                    pseudo_user: WhatTheDuck.app.username,
                    mdp_user:    WhatTheDuck.app.encryptedPassword,
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
    var r = /([^&;=]+)=?([^&;]*)/g;
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