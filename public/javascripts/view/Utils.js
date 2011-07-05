/** 
 * @preserve
 * 
 * Hannotaatio Edit Tool @VERSION_INFO@
 * 
 */
// License and version information here, because Utils.js is the first 
// file in the compiled/minified js file

/**
 * @constructor
 */
var Utils = function() {

};

/**
 * Parses the UUID from given url. Presumes that UUID is the last part of url or
 * it is given as query string
 *
 * @param {string} url Url to be parsed.
 * @return {string} UUID or null if something went wrong.
 */
Utils.prototype.getUUIDFromUrl = function(url) {
	
	// Try to parse UUID from query string
	var query = url.split("?");
	if (query.length === 2) {
		var vars = query[1].split("&");
		var uuid;
		$.each(vars, function(index, keyValue) {
			var keyValueSplit = keyValue.split("=");
			var key = keyValueSplit[0];
			var value = keyValueSplit[1];
			if(key === "uuid") {
				uuid = value;
				return;
			}
		});
		return uuid;
	}
	
	// Try parse UUID after last slash
	var endPart = url.slice(url.lastIndexOf('/') + 1);
	
    if (endPart.length > 35) {
        return endPart;
    } else {
		return null;
    }
};

/**
 * Returns a simple string presentation for date object.
 * Format: 8.2.2010 16:11
 *
 * @param {Date} date Date object to be stringified.
 * @return {string} Date as a human readable string.
 */
Utils.prototype.dateToString = function(date) {

    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
      var minutes = date.getMinutes();

      if (minutes < 10) {
          minutes = '0' + minutes;
      }

      return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
};

/**
 * Function for detecting the browser and OS.
 * Just put the string into the parameter and it returns nice
 * information text including browser name, version and OS.
 * Modified to better suit for own use.
 *
 * Source from: http://www.quirksmode.org/js/detect.html
 *
 * @param {string} browserData Browser data from server.
 * @return {string} A human friendly browser info.
 */
Utils.prototype.detectBrowserOS = function(browserData) {
    log(browserData);
    var BrowserDetect = {
    init: function() {
            this.browser = this.searchString(this.dataBrowser) ||
                    'An unknown browser';
            this.version = this.searchVersion(browserData) ||
                    this.searchVersion(browserData) ||
                    'an unknown version';
            this.OS = this.searchString(this.dataOS) || 'an unknown OS';
            return this.browser + ' ' + this.version + ', ' + this.OS;
    },
    searchString: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = browserData;
                var dataProp = browserData;
                this.versionSearchString = data[i].versionSearch ||
                        data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].string) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
    },
    searchVersion: function(dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            var end = dataString.indexOf(' ', index);
            if (end == -1) end = dataString.length;
            if (index == -1) return;
            return dataString.substring(index +
                    this.versionSearchString.length + 1, end);
    },
    dataBrowser: [
        {
            string: 'Chrome',
            identity: 'Chrome'
        },
        {
            string: 'OmniWeb',
            versionSearch: 'OmniWeb/',
            identity: 'OmniWeb'
        },
        {
            string: 'Apple',
            identity: 'Safari',
            versionSearch: 'Version'
        },
        {
            string: 'Opera',
            identity: 'Opera'
        },
        {
            string: 'iCab',
            identity: 'iCab'
        },
        {
            string: 'KDE',
            identity: 'Konqueror'
        },
        {
            string: 'Firefox',
            identity: 'Firefox'
        },
        {
            string: 'Camino',
            identity: 'Camino'
        },
        {    // for newer Netscapes (6+)
            string: 'Netscape',
            identity: 'Netscape'
        },
        {
            string: 'MSIE ',
            identity: 'MSIE ',
            versionSearch: 'MSIE '
        },
        {
            string: 'Gecko',
            identity: 'Mozilla',
            versionSearch: 'rv'
        },
        {     // for older Netscapes (4-)
            string: 'Mozilla',
            identity: 'Netscape',
            versionSearch: 'Mozilla'
        }
    ],
    dataOS: [
        {
            string: 'Win',
            identity: 'Windows'
        },
        {
            string: 'Mac',
            identity: 'Mac'
        },
        {
            string: 'iPhone',
            identity: 'iPhone/iPod'
        },
        {
            string: 'Linux',
            identity: 'Linux'
        }
        ]

    };
    return BrowserDetect.init();
};

/**
 * This is bad, remove before final release
 * Just created log function to prevent errors in browsers not supporting
 * console.
 * - Antti
 *
 * @param {string} message Log message.
 */
function log(message) {
    if (window.console && window.console.log) {
            window.console.log(message);
    }
}

// (function(){ /* test coverage for JSCoverage */ })();
