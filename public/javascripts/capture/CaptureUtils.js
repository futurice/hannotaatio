/**
 *
 * @constructor
 */
var CaptureUtils = function() {

};

/**
 * Returns true if given param is jQuery object, otherwise false
 *
 * @param {Object} obj Object to test.
 * @return {boolean} true if jQuery object.
 *
 * (Notice: Static method, no .prototype)
 */
CaptureUtils.isJQuery = function(obj) {
    return obj.jquery != null;
};

/**
 * Deeply clones a node
 * @param {Node} node A node to clone.
 * @return {Node} A clone of the given node and all its children.
 *
 * More info: http://brooknovak.wordpress.com/2009/08/23/
 *       ies-clonenode-doesnt-actually-clone/
 */
CaptureUtils.clone = function(node) {
    // If the node is a text node, then re-create it rather than clone it
    var clone = node.nodeType == 3 ? document.createTextNode(node.nodeValue) :
            node.cloneNode(false);

    // Recurse
    var child = node.firstChild;
    while (child) {
            // Don't clone script tags
            if (child.tagName != null &&
                    child.tagName.toLowerCase() === 'script') {
            // Do not clone script tags
            } else {
                    clone.appendChild(CaptureUtils.clone(child));
            }
            child = child.nextSibling;
    }

    return clone;
};

/**
 * Replaces relative url from image's src attribute with absolute url.
 *
 * Notice: You can get the parameters needed from window.location object.
 *
 * @param {jQuery} $image Image as a jQuery object.
 * @param {string} currentLocation Current location (like window.location.href).
 * location is not given. window.location.href is default
 */
CaptureUtils.replaceRelativeUrlFromImg = function($image, currentLocation) {
    var src = $image.attr('src');
	var newSrc = new URL(src, currentLocation);

    $image.attr('src', newSrc.absoluteUrl);
};

/**
 * Replaces relative url's from CSS rule with absolute url.
 *
 * Notice: You can get the parameters needed from window.location object.
 *
 * @param {string} css CSS rule as a string.
 * @param {string} protocol Protocol (for example https:).
 * @param {string} host Hostname and port (for example www.futurice.com:8080).
 * @param {string} pathname Pathname (for example /assets/image.png).
 *
 * @return {string} CSS rule with absolute url.
 */
CaptureUtils.replaceRelativeUrlsFromCSSRule = function(css, currentLocation) {

    var matches = css.match(/url\((.)*?\)/gi);
    var newUrls = [];

    if (matches === null) {
        return css;
    }

    for (var i = 0; i < matches.length; i++) {
        match = matches[i];

        if (match.indexOf('://') !== -1) {
            continue;
        }

        var delim1, delim2;
        if (match.indexOf('url("') !== -1) {
            // url(" <url> ")
            delim1 = 'url("';
            delim2 = '")';
        } else if (match.indexOf('url(\'') !== -1) {
            // url(' <url> ')
            delim1 = 'url(\'';
            delim2 = '\')';
        } else {
            // url( <url> )
            delim1 = 'url(';
            delim2 = ')';
        }

        var split1 = match.split(delim1);
        var split2 = split1[1].split(delim2);

        beforePart = split1[0] + delim1;
        urlPart = split2[0];
        afterPart = delim2 + split2[1];

		url = new URL(urlPart, new URL(currentLocation).absoluteUrl);

        newUrl = beforePart + url.absoluteUrl + afterPart;

        css = css.replace(match, newUrl);
    }

    return css;
};

/**
 * Returns list of URLs in the given css content
 *
 * @param {string} css CSS content
 * @return Array.<string> List of urls
 */
CaptureUtils.parseURLsFromCSSContent = function(css) {
	var urlList = [];
	var matches = css.match(/url\(["']?(.)*?["']?\)/gi);
	
	if(matches == null){
		return urlList;
	}
	
	for (var i = 0; i < matches.length ; i++){
		var match = matches[i];
		// Parse the url between 'url(' and ')'
		var url = match.replace(/(url\(["']?)((.)*?)(["']?)\)/gi, "$2");
		
		urlList.push(url);
	}
	return urlList;
};

/**
 * Strips all the whitespaces. This is mostly used for testing.
 *
 * @param {string} string Given string.
 * @return {string} String without any whitespace characters.
 */
CaptureUtils.stripWhitespaces = function(string) {
    var whitespaceRegExp = /\s+/g;
    return string.replace(whitespaceRegExp, '');
};

/**
 * Captures image from url and encodes it to base 64 Data URI.
 *
 * @param {URL} imageUrl url of image to be encoded.
 * @param {function(string)} callback Callback function with arguments data and url.
 *   If image doesn't exist, data is null
 */
CaptureUtils.imageURLToBase64 = function(imageUrl, callback) {
    if (CaptureUtils.isCanvasSupported() === false) {
        callback(null);
        return;
    }

    var $img = $('<img />');
    $img.load(function() {
        callback(CaptureUtils.imgToBase64(this), imageUrl);
    }).error(function() {
        // Return null data if error occured while loading
        callback(null, imageUrl)
    });
    
    $img.attr('src', imageUrl.absoluteUrl);
};

/**
 * Detect if canvas is supported
 * http://stackoverflow.com/questions/2745432/
 * best-way-to-detect-that-html5-canvas-is-not-supported
 *
 * @return {boolean} true or false.
 */
CaptureUtils.isCanvasSupported = function() {
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};

/**
 * Converts img content to base64
 * 
 * http://stackoverflow.com/questions/934012/get-image-data-in-javascript
 *
 * @param {HTMLImageElement} img Image to capture as DOM element.
 * @return {string} Encoded image.
 */
CaptureUtils.imgToBase64 = function(img) {

    // Cannot get data if image or src is null
    if (CaptureUtils.isCanvasSupported() === false || img == null ||
            img.src == null) {
        return null;
    }

    // Create an empty canvas element
    var canvas = document.createElement('canvas');

    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode
    // the image.
    var parts = img.src.split('.');
    var lastIndex = parts.length > 0 ? parts.length - 1 : 0;
    var ext = parts[lastIndex].toLowerCase();

    // Canvas lacks support for others
    var defaultMimeType = 'image/png';

    var dataURL = canvas.toDataURL(defaultMimeType);

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};

/**
 * Returns array with only unique values
 *
 * @param {Array} array Array with values
 * @param {boolean} duplicate If false, doesn't modify the original
 * array. A copy is returned instead
 * @return {Array} Array with unique values.
 */
CaptureUtils.unique = function (array, duplicate) {
	duplicate = duplicate ? array.concat() : array; 
	for (var i=0; i < duplicate.length; i++) { 
		if (duplicate.indexOf(duplicate[i]) < i) { 
			duplicate.splice(i--); 
		} else { 
			return duplicate; 
		} 
	}
};

CaptureUtils.extensionFromUrl = function(url) {
	var file = url.parsedUrl.file;
	var lastIndexOfDot = file.lastIndexOf('.');
	if(lastIndexOfDot !== -1){
		var extension = file.substr(lastIndexOfDot, file.length).toLowerCase();
		return extension;
	} else {
		return "";
	}
}

// (function(){ /* test coverage for JSCoverage */ })();
