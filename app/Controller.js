WhatTheDuck.controller = (function ($, app) {

    var countryListSelector = "#country-list-content";
    var noCountryCachedMsg = "<pre><div>No country</div></pre>";
    var countryListPageId = "country-list-page";
    var currentCountry = null;

    var publicationListSelector = "#publication-list-content";
    var noPublicationCachedMsg = "<pre><div>No publication</div></pre>";
    var publicationListPageId = "publication-list-page";

    var countryListStorageKey = "WhatTheDuck.CountryList";


    function init() {
        app.init(countryListStorageKey);
        $(document)
            .bind("pagechange", onPageChange)
            .bind("pagebeforechange", onPageBeforeChange);
    }

    function onPageBeforeChange(event, data) {

        if (typeof data.toPage === "string") {
            var url = $.mobile.path.parseUrl(data.toPage);
            if ($.mobile.path.isEmbeddedPage(url)) {
                data.options.queryString = $.mobile.path.parseUrl(url.hash.replace(/^#/, "")).search.replace("?", "");
            }
        }
    }

    function onPageChange(event, data) {
        var toPageId = data.toPage.attr("id");

        var fromPageId = null;
        if (data.options.fromPage) {
            fromPageId = data.options.fromPage.attr("id");
        }

        switch (toPageId) {
            case countryListPageId:
                renderCountryList();
            break;

            case publicationListPageId:
                if (fromPageId === countryListPageId) {
                    renderPublicationList(data);
                }

            break;
        }
    }

    function renderCountryList() {

        var countryList = app.getCountryList();
        var view = $(countryListSelector);

        view.empty();

        if (countryList.length === 0) {

            $(noCountryCachedMsg).appendTo(view);
        }
        else {

            var countryCount = countryList.length;
            var country;
            var publicationPageUrl;
            var ul = $("<ul id=\"notes-list\" data-role=\"listview\"></ul>").appendTo(view);
            for (var i = 0; i < countryCount; i++) {
                country = countryList[i];
                publicationPageUrl = "index.html#"+publicationListPageId+"?countryId=" + country.countrycode;
                $("<li>" + "<a data-role=\"button\" data-icon=\"delete\" data-url=\"" + publicationPageUrl + "\" href=\"" + publicationPageUrl + "\">" + "<div>" + country.countryname + "</div>" + "<div class=\"list-item-narrative\">" + country.countryname + "</div>" + "</a>" + "</li>").appendTo(ul);
            }

            ul.listview();
        }
    }


    function renderPublicationList(data) {

        var view = $(publicationListSelector);

        var u = $.mobile.path.parseUrl(data.options.fromPage.context.URL);
        var re = "^#" + publicationListPageId;
        if (u.hash.search(re) !== -1) {

            var queryStringObj = queryStringToObject(data.options.queryString);
            var countryId = queryStringObj.countryId;

            if (countryId === undefined) {
                $(noPublicationCachedMsg).html(view);
            }
            else {
                currentCountry = countryId;
            }
        }
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

    return {
        init: init
    };


})(jQuery, WhatTheDuck.app);