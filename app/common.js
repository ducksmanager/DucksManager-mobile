function onPageBeforeChange(event, data) {

    if (typeof data.toPage === "string") {
        var url = $.mobile.path.parseUrl(data.toPage);
        if ($.mobile.path.isEmbeddedPage(url)) {
            data.options.queryString = $.mobile.path.parseUrl(url.hash.replace(/^#/, "")).search.replace("?", "");
        }
    }
}

function getPage(parameters, callback) {
    $.ajax({
        url: 'gateway.php',
        type: 'post',
        data: { parameters: JSON.stringify(parameters)},
        dataType: "json",
        success: callback
    });
}

function queryStringToObject(queryString) {

    var queryStringObj = {};
    var e;
    var a = /\+/g;  // Replace + symbol with a space
    var r = /([^&;=]+)=?([^&;]*)/g;
    var d = function (s) {
        return decodeURIComponent(s.replace(a, " "));
    };

    e = r.exec(queryString);
    while (e) {
        queryStringObj[d(e[1])] = d(e[2]);
        e = r.exec(queryString);
    }

    return queryStringObj;
}