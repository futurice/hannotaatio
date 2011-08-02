/**
 * Class for URL
 *
 * @constructor
 *
 * @param {string} url The url. Can be absolute or relative.
 * @param {string} location The location of the current url. Can be only absolute.
 */
var URL = function(url, location) {
	this.url = url || window.location.href;
	this.location = location || window.location.href;
	
	if(URL.isRelative(this.location)){
		throw new Error('Location can not be relative [location: ' + this.location + ']');
	}
	
	// Initialize
	this.parsedUrl = URL.parseUrl(this.url);
	this.parsedLocation = URL.parseUrl(this.location);
	
	this.isRelative = URL.isRelative(this.parsedUrl);
	this.isSameDomain = URL.isSameDomain(this.parsedUrl, this.parsedLocation);
	this.absoluteUrl = URL.absoluteUrl(this.parsedUrl, this.parsedLocation);
};

/**
 * Returns the original url
 * 
 * @return {string} Original url
 */
URL.prototype.getUrl = function() {
	return this.url;
}

/**
 * Returns true if url is relative
 *
 * @param {string} url The url
 * @return {boolean} true if url is relative
 */
URL.isSameDomain = function(url, location) {
	var url = typeof url === 'string' ? URL.parseUrl(url) : url;
	var location = typeof location === 'string' ? URL.parseUrl(location) : location;
	
	// Relative is always on same domain
	if( URL.isRelative(url) ){
		return true;
	}
	
	if( url.protocol === location.protocol && 
		url.host === location.host ){
			// Special port 80
			if( url.port === location.port ){
				return true;
			} else {
				if( (url.port === '' && location.port === '80') || 
					(url.port === '80' && location.port === '') ){
					return true;
				} else {
					return false;
				}
			}
	} else {
		return false;
	}
};

URL.parseUrl = function(url) {
	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License
	// http://blog.stevenlevithan.com/archives/parseuri
	function parseUri (str) {
		var	o   = parseUri.options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;

		while (i--) uri[o.key[i]] = m[i] || "";

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});

		return uri;
	};

	parseUri.options = {
		strictMode: true,
		key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
		q:   {
			name:   "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};
	
	return parseUri(url);
};

/**
 * Checks if given url is relative
 *
 * Example results (current domain: www.hannotaatio.com):
 * - http://www.hannotaatio.com/assets/stylesheet.css : false
 * - http://www.futurice.com/assets/stylesheet.css : false
 * - /assets/stylesheet.css : true
 * - assets/stylesheet.css : true
 *
 * @param {String} url Url.
 * @return {Boolean} True if given url is relative.
 */
URL.isRelative = function(url) {
	var url = typeof url === 'string' ? URL.parseUrl(url) : url;
    return url.protocol == null || url.protocol == '';
};

URL.isAbsolute = function(url) {
    return !URL.isRelative(url);
}

URL.absoluteUrl = function(url, location) {
	var url = typeof url === 'string' ? URL.parseUrl(url) : url;
	var location = typeof location === 'string' ? URL.parseUrl(location) : location;
	
	if(!URL.isRelative(url)){
		return url.source;
	}
	
	var port = location.port === '' ? '' : ':' + location.port;
	
	if(url.directory === '' || url.directory.charAt('0') !== '/' || url.source.substring(0, 3) === '../'){
		// alert('First, url.source: ' + url.source + ', url.directory: ' + url.directory + ', url.directory[0]: ' + url.directory[0] + ', url.source.substring(0, 3): ' + url.source.substring(0, 3));
		// For example 'file.html' or 'assets/image.png' or '../images/image.png'
		return location.protocol + '://' + location.host + port + location.directory + url.source;
	} else {
        // alert('Second, url.source: ' + url.source + ', url.directory: ' + url.directory + ', url.directory[0]: ' + url.directory[0] + ', url.source.substring(0, 3): ' + url.source.substring(0, 3));
		// For example '/file.html'
		return location.protocol + '://' + location.host + port + url.source;
	}
};