/**
 * Capture the webpage DOM tree.
 * https://www.pivotaltracker.com/story/show/5827718
 *
 * @constructor
 * @param {jQuery} $element The element to capture.
 * @param {Preferences} prefs Capturer preferences.
 */
var Capturer = function($element, prefs) {

    // Elements must from now on be only of type jQuery. The absence of this
    // test has lead to several needless debugging efforts.
    if (!CaptureUtils.isJQuery($element)) {
        throw new Error('Given element must be of type jQuery.');
    }
    this.prefs = prefs || {};

    // Do capture
    this.$elementToCapture = $(CaptureUtils.clone($element.get(0)));
    this.doctype = this.captureDoctype();

    // Fields related to the Annotation metadata
    this.uuid = this.generateUUID();
    this.captureTime = new Date().getTime() / 1000;

    this.stylesheetsCaptured = 0;
};

/**
 * Gerenates UUID-like random id.
 *
 * The code is copy-pasted from Stackoverflow
 * http://stackoverflow.com/
 * questions/105034/how-to-create-a-guid-uuid-in-javascript
 *
 * Comments from stackoverflow:
 * "For an rfc4122 version 4 compliant solution,
 * this one-liner(ish) solution is the most compact
 * I could come up with."
 *
 * @return {String} valid rfc4122 version 4 compliant UUID string.
 */
Capturer.prototype.generateUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
};

/**
 * Remove <script></script> tags from the captured element.
 */
Capturer.prototype.stripScriptTags = function() {
    $('script', this.$elementToCapture).remove();
};

/**
 * Remove capture controls (button and status div).
 */
Capturer.prototype.removeCaptureControls = function() {
    $('#hannotaatio-capture', this.$elementToCapture).remove();
    $('#hannotaatio-status', this.$elementToCapture).remove();
};

/**
 * Captures all the external stylesheet data and embeds the
 * data to the DOM tree by adding a new <script> element
 * to the DOM.
 *
 * Local stylesheets are captured on the client-side but
 * because of the browser cross-domain restrictions
 * the capturing of the stylesheets hosted on some other
 * than local domain has to be done on the backend side
 *
 * @param {Function} callback callback function.
 */
Capturer.prototype.captureStylesheets = function(callback) {
    var stylesheetsCaptured = false;
    
    // Capture by default
    if(!(this.prefs && this.prefs.captureStylesheets === false)) {
    
        var stylesheets = document.styleSheets;
        for (var i = stylesheets.length - 1; i >= 0; i--) {

            var styleSheet = document.styleSheets[i];
            var captureMedia = this.hasCapturableMediaType(styleSheet);

            if (captureMedia === true) {
                var href = styleSheet.href;
                var hasHref = href !== null &&
                        href !== undefined && href.length > 0;
			    var stylesheetUrl = new URL(href);
                if (hasHref) {
                    if (stylesheetUrl.isSameDomain) {
                        this.captureStylesheet(styleSheet, i);
                    } else {
                        this.captureOtherDomainStylesheet(styleSheet, i);
                    }
                } else {
                    // Doesn't have href. So it's <style> tag. Capture.
                    this.captureStylesheet(styleSheet, i);
                }
            }
        }
        stylesheetsCaptured = true
    }

    if (typeof callback === 'function') {
        callback(stylesheetsCaptured);
    }
};

/**
 * Analyses the media type of the stylesheet and returns true if the
 * stylesheet should be captured
 *
 * @param {StyleSheet} styleSheet StyleSheet DOM element.
 * @return {boolean} true if the stylesheet should be captured.
 */
Capturer.prototype.hasCapturableMediaType = function(styleSheet) {
    var media = styleSheet.media;
    // plain 'media' for IE
    var mediaText = media.mediaText != null ? media.mediaText : media;
    var captureMedia = false;

    var mediaList = [];
    $.each(mediaText.split(','), function(index, value) {
        var mediaValue = CaptureUtils.stripWhitespaces(value);
        if (mediaValue.length > 0) {
            mediaList.push(mediaValue);
        }
    });

    if (mediaList.length === 0) {
        captureMedia = true;
    } else {
        $.each(mediaList, function(index, value) {
            if (value === 'all' || value === 'screen') {
                captureMedia = true;
                return false;
            }
        });
    }

    return captureMedia;
};

/**
 * Captures CSS rules from the given stylesheet.
 *
 * @param {StyleSheet} stylesheet StyleSheet DOM Element.
 * @return {string} CSS rules as a string.
 */
Capturer.prototype.captureRules = function(stylesheet) {
    var stylesheetRules = [];
    var stylesheetContent;
    if (stylesheet.cssText != null) {

            // Capture IE imports
            var captureIEImports = function(stylesheet) {

                    var imports = stylesheet.imports || false;
                    var rules = [];

                    if (imports) {

                            for (var i = 0; i < imports.length; i++) {
                                    rules.push(captureIEImports(imports[i]));
                }
                    }
                    rules.push(stylesheet.cssText);

                    return rules.join(' ');
            }

            stylesheetContent = captureIEImports(stylesheet);

            // Remove imports
            var importRegexp = /@import(.)*?url\((.)*?\)(;)?/gi;
            stylesheetContent = stylesheetContent.replace(importRegexp, '');

    } else {
        stylesheetContent = false;
    }

    if (stylesheetContent === false) {
        // Other browsers than IE

        var cssRules = stylesheet.cssRules;
        var capturedRules = [];

        for (var i = 0; i < cssRules.length; i++) {
            if (cssRules[i].styleSheet) {
                // Is @import rule (not for IE)
                var importedStylesheet = cssRules[i].styleSheet;
                var importedRules = this.captureRules(importedStylesheet);
                capturedRules.push(importedRules);
            }
            else {
                // Is normal rule
                capturedRules.push(cssRules[i].cssText);
            }
        }
        stylesheetContent = capturedRules.join(' ');
    }

    return stylesheetContent;
};

/**
 * Captures stylesheets that are on the local domain. The stylesheet data
 * is captured and embedded to the DOM tree using by adding new <style>
 * element to the exactly same position where the stylesheet link was.
 * After embedding the data the link element is removed
 *
 * @param {StyleSheet} stylesheet DOM stylesheet object to capture.
 * @param {number} index stylesheet index in document.stylesheet array.
 */
Capturer.prototype.captureStylesheet = function(stylesheet, index) {

    if (stylesheet.href && stylesheet.href.indexOf('qunit.css') !== -1) {
        // Ignore this
        // Notice: This is a bit ugly hardcoded stuff. Please do change
        // this is you know any better way
        return;
    }

    var stylesheetContent = CaptureUtils.replaceRelativeUrlsFromCSSRule(
            this.captureRules(stylesheet), stylesheet.href);

    var $newStyleTag = $('<style type="text/css" ' +
            'class="hannotaatio_embeded_stylesheet hannotaatio_embeded_id_' +
            this.stylesheetsCaptured + '">' +
            stylesheetContent + '</style>');

    this.stylesheetsCaptured++;

    this.replaceStylesheet(stylesheet, $newStyleTag, index);
};

/**
 * Replaces old stylesheet with new one. Notice that the replacement is done
 * for the cloned element, not for the original document
 *
 * @param {StyleSheet} stylesheet Old StyleSheet DOM element.
 * @param {jQuery} $newStylesheet New stylesheet element as a jQuery object.
 * @param {number} index Stylesheet index in document.stylesheets array.
 */
Capturer.prototype.replaceStylesheet = function(stylesheet, $newStylesheet,
        index) {
    var $ownerCandidate = $('link, style', this.$elementToCapture);
    var $owner = $ownerCandidate.eq(index);

    $owner.after($newStylesheet);

    // Remove original element
    $owner.remove();
};

/**
 * Capture images. Return true if images were actually captured,
 * otherwise return false. Callback is called after the operation
 * is done
 */

Capturer.prototype.captureImages = function(callback) {
    var prefs = this.prefs;
    var capturer = this;
    
    if (prefs.captureImages) {
        var imageUrls = capturer.getUniqueImageURLs();
        var imageCapturer = new ImageCapturer(prefs, imageUrls, function(capturingMethod){
            if (capturingMethod === ImageCapturer.Method.NONE) {
                capturer.replaceRelativeImgUrls();
                callback(false); // return false since images were not captured
            }
            else {
                this.capture(function(images){
                    capturer.setCapturedImages(images);
                    capturer.updateImageUrls();
                    callback(true); // images captured
                });
            }
        });
    }
    else {
        capturer.replaceRelativeImgUrls();
        callback(false); // not captured
    }
};

/*
var captureImages = function(){
    if (prefs.captureImages) {
        var imageUrls = capturer.getUniqueImageURLs();
        var imageCapturer = new ImageCapturer(prefs, imageUrls, function(capturingMethod){
            if (capturingMethod === ImageCapturer.Method.NONE) {
                capturer.replaceRelativeImgUrls();
                upload();
            }
            else {
                this.capture(function(images){
                    capturer.setCapturedImages(images);
                    capturer.updateImageUrls();
                    upload();
                });
            }
        });
    }
    else {
        capturer.replaceRelativeImgUrls();
        upload();
    }
}
*/

/**
 * Sets captured image
 * 
 * Notice: After calling this you probably want to call
 * updateImageUrls.
 * 
 * @param {Object} images
 */
Capturer.prototype.setCapturedImages = function(images) {
    this.capturedImages = images;
};

/**
 * After images are captured and set to capturer using 
 * setCapturedImages calling this method changes the 
 * paths of images according to captured images.
 */
Capturer.prototype.updateImageUrls = function () {
    this.updateImgTagUrls();
	this.updateStyleUrls();
};

/**
 * @private
 */
Capturer.prototype.updateImgTagUrls = function() {
	var images = this.capturedImages;
	if(images == null){
		return;
	}
	
	$('img', this.$elementToCapture).each(function(index) {
		var $oldImg = $(this);
		var oldSrc = $oldImg.attr('src');
		var capturedImage = images[oldSrc];
		
		if(capturedImage) {
			var $newImg = $oldImg.clone().attr('src', capturedImage.newUrl);
			$oldImg.after($newImg);
			$oldImg.remove();
		}
	})
};

/**
 * Replaces old img with new one. Notice that the replacement is done
 * for the cloned element, not for the original document
 *
 * @param {StyleSheet} img Old img DOM element.
 * @param {jQuery} $newImg New img element as a jQuery object.
 * @param {number} index Img index
 */
Capturer.prototype.replaceImg = function(img, $newImg,
        index) {
    var $ownerCandidate = $('img', this.$elementToCapture);
    var $owner = $ownerCandidate.eq(index);

    $owner.after($newImg);

    // Remove original element
    $owner.remove();
};

/**
 * @private
 */
Capturer.prototype.updateStyleUrls = function() {
    var images = this.capturedImages;
    if(images == null){
        return;
    }
	
	$('style', this.$elementToCapture).each(function() {
	
		var $currentStyle = $(this);
		var content = this.innerHTML;
	
		$.each(images, function(url, value) {
			var absoluteUrl = (new URL(url)).absoluteUrl;
			var regexp = new RegExp('url\\(["\']?' + absoluteUrl + '["\']?\\)', 'g');
			
			content = content.replace(regexp, "url(" + value.newUrl + ") ");
		});
		
		// NOTICE: We're creating a completely new style tag here because
		// IE is not able to change the content of existing style tag
		// (at least as far as I know...)
		var styleClass = $currentStyle.attr('class');
		var $newStyle = $('<style type="text/css" class="' + styleClass + '">' + content + '</style>')
			
		$currentStyle.replaceWith($newStyle)
	});
};

/**
 * Returns list of all unique local <img> urls and urls used in the
 * CSS stylesheets.
 *
 * Notice! The CSS urls are taken only from <style> tags.
 * This means that the stylesheets has to be captured before
 * calling this method
 *
 * @return {Array.<URL>} URLs
 */
Capturer.prototype.getUniqueImageURLs = function() {
	var absoluteImageUrlStrings = [];
	var imageUrls = [];

	var pushIfNotInArray = function(urlString){
		var url = new URL(urlString);
		var e = CaptureUtils.extensionFromUrl(url);
		if(e === '.jpeg' || e === '.jpg' || e === '.gif' || e === '.png'){
			// Check that URL is not yet in the array and check that it's
			// in the same domain
			if($.inArray(url.absoluteUrl, absoluteImageUrlStrings) === -1 && url.isSameDomain){
				imageUrls.push(url);
				absoluteImageUrlStrings.push(url.absoluteUrl);
			}
		}
	}

	// Fetch <img> elements
	$('img', this.$elementToCapture).each(function() {
		pushIfNotInArray($(this).attr('src'));
    });

	// Fetch <style> tags
	$('style', this.$elementToCapture).each(function() {
		var content = $(this).html();
		var urlsFromStyleContent = CaptureUtils.parseURLsFromCSSContent(content);
		for (var i = 0; i < urlsFromStyleContent.length ; i++){
			pushIfNotInArray(urlsFromStyleContent[i]);
		}
	});

	return imageUrls;
}

/**
 * Iterates through all img elements and replaces their
 * relative url with absolute url if needed.
 */
Capturer.prototype.replaceRelativeImgUrls = function() {
    $('img', this.$elementToCapture).each(function() {
        CaptureUtils.replaceRelativeUrlFromImg($(this));
    });
};

/**
 * Captures stylesheets that are not on the local domain. The
 * capturing is done on the backend side so this method only
 * sends the stylesheet link to the backend server
 *
 * @param {StyleSheet} stylesheet DOM stylesheet object to capture.
 */
Capturer.prototype.captureOtherDomainStylesheet = function(stylesheet) {
    // TODO 1) Thing first do we even want to capture stylesheets hosted on
    //         other domains? Usually those stylesheets are publicly available
    //         or they are stylesheets of some publicly available library
    //         like jQuery UI
    // TODO 2) Implement
};

/**
 * Gets the Annotation metadata which is contained in this Capturer object. The
 * annotation metadata includes fields such as the UUID of the page, the
 * capturing time and the page dimensions. The metadata is returned as an
 * Object.
 *
 * @return {string} The Annotation metadata of this capture. The data is given
 *         as an Object (JSON).
 */
Capturer.prototype.getAnnotationMetadata = function() {
    var annotationData = {
       'annotation': {
           'uuid': this.uuid,
           'site_name': this.prefs.site.name,
           'capture_time': this.captureTime,
           'captured_url': window.location.href,
           'body_width': $(document).width(),
           'body_height': $(document).height()
       }
    };
    return annotationData;
};

/**
 * Captures the DOCTYPE of the document.
 *
 * Returns DOCTYPE as a string or null if unable
 * to capture doctype
 *
 * Check out this stackoverflow for more info:
 * http://stackoverflow.com/questions/1987493/read-doctype-with-javascript
 *
 * @return {string} doctype or null.
 */
Capturer.prototype.captureDoctype = function() {
    var doctype = document.doctype;

    if (doctype == null) {
        // No doctype or IE
        var firstChild = document.childNodes[0];

        // IE mis-parses doctype as a Comment element
        var firstChildContent = firstChild.text;

        if (firstChildContent != null &&
                firstChildContent.indexOf('<!DOCTYPE') !== -1) {
            // Is IE and firstChild is doctype element!!
            return firstChildContent;
        } else {
            // No doctype found
            return null;
        }
    }

    var publicId = doctype.publicId;
    var systemId = doctype.systemId;

    if (publicId == null || systemId == null) {
        // No publicId or systemId, no idea why...
        return null;
    }

    if (publicId.length == 0 || systemId.length == 0) {
        // publicId and systemId length 0. Probably HTML5
        return '<!DOCTYPE HTML>';
    }

    var isXHTML = publicId.indexOf('XHTML') !== -1;
    var html = isXHTML ? 'html' : 'HTML';

    var doctype = '<!DOCTYPE ' + html + ' PUBLIC "' + publicId + '" "' +
        systemId + '">';

    return doctype;
};

/**
 * Gets the captured doctype as a string or null
 * if there is no doctype defined
 *
 * @return {string} The doctype string or empty string.
 */
Capturer.prototype.getDoctype = function() {
    return this.doctype;
};

/**
 * Gets the captured element's full HTML content as a string.
 *
 * @return {string} The contents of captured element.
 */
Capturer.prototype.getHtmlContent = function() {
    if (this.$elementToCapture.get(0).outerHTML) {
        // outerHTML property works on IE, Chrome, Safari and Opera
        return $.trim(this.$elementToCapture.get(0).outerHTML);
    }
    else {
        // On Firefox we need to hack a bit
        return this.$elementToCapture.wrap('<div></div>').parent().html();
    }
};

/**
 * @return {string} The contents of the element to capture.
 */
Capturer.prototype.toString = function() {
    return this.getHtmlContent();
};

// (function(){ /* test coverage for JSCoverage */ })();
