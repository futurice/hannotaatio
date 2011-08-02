/**
 * Captures images in the document
 *
 * @constructor
 *
 * @param {Preferences} prefs Capturer preferences.
 * @param {Array.<URL>} Array of urls. If the array includes duplicates, they'll
 * be removed
 */
var ImageCapturer = function(prefs, urls, callback) {

	/**
	 * @private
	 */
	this._prefs = prefs;

	/**
	 * @private
	 */
	this._urls = urls;

    // Avoid name collision
	this.flashImagesEncodedCallback = ImageCapturer.FLASH_IMAGES_ENCODED_CALLBACK + '_' + ImageCapturer.counter;
	this.flashLoadedCallback = ImageCapturer.FLASH_LOADED_CALLBACK + '_' + ImageCapturer.counter;
	this.flashContainerId = ImageCapturer.FLASH_CONTAINER_ID + '_' + ImageCapturer.counter;
	ImageCapturer.counter++;

	var that = this;
	this.loadSWFObject(prefs, function(loaded) {
		var hasJPEGImages = that.containsJPEGs(that._urls);
		var isCanvasAvailable = ImageCapturer.isCanvasSupported();
		var isFlashAvailable = that._prefs.crossDomainFileAvailable && that.detectFlashPlayer();

		that._capturingMethod = that.selectCapturingMethod(hasJPEGImages, isCanvasAvailable, isFlashAvailable);

		if( callback ) {
			callback.apply(that, [that._capturingMethod]);
		}
	});
}

/**
 * Static incremental instance counter
 */
ImageCapturer.counter = 0;

/**
 *
 */
ImageCapturer.prototype.selectCapturingMethod = function(hasJPEGImages, isCanvasAvailable, isFlashAvailable) {
	if( hasJPEGImages ) {
		if ( isFlashAvailable ) {
			return ImageCapturer.Method.FLASH;
		} else {
			// No Flash, use canvas if possible
			if ( isCanvasAvailable ) {
				return ImageCapturer.Method.CANVAS;
			} else {
				return ImageCapturer.Method.NONE;
			}
		}
	} else {
		// No JPEGs
		if ( isCanvasAvailable ) {
			return ImageCapturer.Method.CANVAS;
		} else {
			if ( isFlashAvailable ) {
				return ImageCapturer.Method.FLASH;
			} else {
				return ImageCapturer.Method.NONE;
			}
		}
	}
}

/**
 * Returns true if Flash Player is available
 *
 * @return {boolean} true if Flash Player available
 */
ImageCapturer.prototype.detectFlashPlayer = function() {
	return swfobject.hasFlashPlayerVersion("9.0.0");
}

/**
 * Detect if canvas is supported
 * http://stackoverflow.com/questions/2745432/
 * best-way-to-detect-that-html5-canvas-is-not-supported
 *
 * @return {boolean} true or false.
 */
ImageCapturer.isCanvasSupported = function() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

/**
 * Checks if there are any JPEG images in the given
 * list of urls
 *
 * @param Array.<URL> image urls
 * @return {boolean} false if there were no JPEGs
 */
ImageCapturer.prototype.containsJPEGs = function(urls) {
	for( var i = 0; i < urls.length ; i++ ) {
		var extension = CaptureUtils.extensionFromUrl(urls[i]);
		if(extension === '.jpg' || extension === '.jpeg') {
		    return true;
		}
	}
	return false;
}

ImageCapturer.prototype.loadSWFObject = function(prefs, callback) {
	if(window.swfobject != null){
		// Loaded already
		callback(true);
		return;
	}

	if(!prefs.crossDomainFileAvailable) {
		// No cross domain file, no need to load SWFObject
		callback(false);
		return;
	}

	// Load
	var d;
    var loaded = false;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js';
    script.onload = script.onreadystatechange = function() {
        if (!loaded && (!(d = this.readyState) || d == 'loaded' ||
                d == 'complete')) {
            callback(loaded = true);
        }
    };
    document.documentElement.childNodes[0].appendChild(script);
}

ImageCapturer.prototype.capture = function(callback, method) {
    var capturingMethod = method || this._capturingMethod;
	var urls = this._urls;
    var imagesToEncode = urls.length;
    var images = {};
	var that = this;

	var flashImagesEncodedCallback = this.flashImagesEncodedCallback;
	var flashLoadedCallback = this.flashLoadedCallback;
	var flashContainerId = this.flashContainerId;
	
	var pushToImages = function(images, url, data) {
		images[url.url] = {newUrl: ImageCapturer.filenameFromPath(url), data: data};
	}
	
    if(imagesToEncode === 0){
        callback(images);
    }
		
	if( capturingMethod === ImageCapturer.Method.NONE ) {
		return;
	} else if ( capturingMethod === ImageCapturer.Method.CANVAS ) {
		var imagesEncoded = 0;
		
		for ( var i = 0; i < urls.length ; i++ ) {
			CaptureUtils.imageURLToBase64(urls[i], function(data, url) {
                if(data === null) {
                    // Image loading failed
                    imagesToEncode--;
                } else {
                    // Image loaded successfully.
                    imagesEncoded++;
    				pushToImages(images, url, data);                    
                }

				if( imagesEncoded >= imagesToEncode ) {
					callback(images);
				}
			});
		}

	} else if ( capturingMethod === ImageCapturer.Method.FLASH ) {
		this.injectFlashEncoder(function() {
		   window[flashImagesEncodedCallback] = function(response) {
			  
			  var imageData = response.split(";");

              for ( var i = 0; i < imageData.length ; i++ ) {
			     var url = urls[i];
				 var data = imageData[i];
				 
				 // Data is empty if Flash was unable to load the image
				 if(data !== "") {
				     pushToImages(images, url, data);
			     }
			  }
			  callback(images);
		   };
		   
		   var params = [];
		   for (var i = 0; i < urls.length; i++) {
		      params.push(urls[i].absoluteUrl);
		   }
		   params.push(flashImagesEncodedCallback);

           swfobject.getObjectById(flashContainerId).encodeImages(params.join(";"));
		})
	} else {
		throw new Error('Illegal capturing method');
	}
};

ImageCapturer.prototype.injectFlashEncoder = function(callbackFunction) {
	// Flash container
	var $flashContainer = $('<div id="' + this.flashContainerId + '"></div>').hide();
	$('body').append($flashContainer);
	
	// Callback
	window[this.flashLoadedCallback] = callbackFunction;
	
	// Flash
	var flashvars = { };
	var params = {
        allowscriptaccess: "always"
    };
    var attributes = { };

    swfobject.embedSWF(this._prefs.flash_url + 'image_encoder.swf?debug=false&onLoadCallback=' + this.flashLoadedCallback, this.flashContainerId, "1", "1", "9.0.0","expressInstall.swf", flashvars, params, attributes);
};

ImageCapturer.filenameFromPath = function(imageUrl) {
	return imageUrl.parsedUrl.relative.replace(/\//gi, '_');
}

/**
 * @const
 * @type {string}
 */
ImageCapturer.FLASH_IMAGES_ENCODED_CALLBACK = 'hannotaatio_flash_images_encoded_callback';

/**
 * @const
 * @type {string}
 */
ImageCapturer.FLASH_LOADED_CALLBACK = 'hannotaatio_flash_loaded_callback'

/**
 * @const
 * @type {string}
 */
ImageCapturer.FLASH_CONTAINER_ID = 'hannotaatio_flash_container';

/**
 * Capturing method enum
 * @enum {string}
 */
ImageCapturer.Method = {
	NONE: 'none',
	CANVAS: 'canvas',
	FLASH: 'flash'
};
