var SERVER_PAGE='WhatTheDuck.php';
var DUCKSMANAGER_URL='http://www.ducksmanager.net';
var DUCKSMANAGER_PAGE_WITH_REMOTE_URL='WhatTheDuck_server.php';
var SERVER_URL;

function onPageBeforeChange(event, data) {

    if (typeof data.toPage === 'string') {
        var url = $.mobile.path.parseUrl(data.toPage);
        if ($.mobile.path.isEmbeddedPage(url)) {
            data.options.queryString = $.mobile.path.parseUrl(url.hash.replace(/^#/, '')).search.replace('?', '');
        }
    }
}
    
function getServerPage() {
    if (!SERVER_URL) {
        getPage(
            DUCKSMANAGER_URL+'/'+DUCKSMANAGER_PAGE_WITH_REMOTE_URL, 
            function(response) {
                SERVER_URL = response;
            }, 
            {}, 
            'script'
        );
    }
}

function getPage(url, callback, parameters, dataType) {
    $.ajax({
        url: url,
        type: 'post',
        data: parameters,
        dataType: dataType || 'json',
        success: callback,
        error: function(response) {
            alert(response.responseText);
        }
    });
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