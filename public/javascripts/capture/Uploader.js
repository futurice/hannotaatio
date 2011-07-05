/**
 * Uploader is responsible of sending the contents of one Capturer object to
 * the API server. There are two different methods of sending the annotation:
 * an AJAX based approach and a HTML Form based approach. Both methods use the
 * same input, that is an Capturer object.
 *
 * @constructor
 * @param {Preferences} prefs The preferences are used when
 * determining upload url and parameters to identify
 * different projects.
 */
var Uploader = function(prefs) {
    this.prefs = prefs;
};

/**
 * Creates a new Annotation in the Hannotatio service using AJAX. The Annotation
 * consists of several entities that are saved using separate REST requests. One
 * Annotation consists of at least the Annotation metadata (including the UUID),
 * and the actual HTML content of the page to annotate.
 *
 * @param {Capturer} capturer a Capturer object.
 * @param {function(string)} successCallback Called with the content
 * when the upload is complete. Optional.
 * @param {function(string)} errorCallback error callback.
 */
Uploader.prototype.uploadAjax = function(capturer, successCallback,
        errorCallback) {
    var annotations_url = this.prefs.api_url + 'annotations';
    var uuid = capturer.uuid;
    var annotationMetadata = capturer.getAnnotationMetadata();
    var htmlContent = capturer.getHtmlContent();

    $.ajax({
        type: 'POST',
        // Make sure that the site is located on the same domain as the url
        url: annotations_url,
        contentType: 'application/json',
        processData: false,
        dataType: 'json',
        data: HannotaatioJSON.stringify(annotationMetadata),
        complete: function(request, status) {
            if (request.status == 201) {
                $.ajax({
                    type: 'POST',
                    // Make sure that the site is located on the same
                    // domain as the url
                    url: annotations_url + '/' + uuid + '/capture/page.html',
                    contentType: 'text/html',
                    data: htmlContent,
                    complete: function(request, status) {
                        if (request.status == 201) {
                            successCallback(request.status);
                        } else {
                            errorCallback(request.status);
                        }
                    }
                });
            }
            else {
                errorCallback(request.status);
            }
        }
    });
};

/**
 * Creates a new Annotation in the Hannotatio service using a HTML Form. See the
 * corresponding AJAX function for more details.
 *
 * @param {Capturer} capturer a Capturer object.
 */
Uploader.prototype.uploadForm = function(capturer) {
    var annotations_url = this.prefs.api_url + 'annotations/' + '?api_key=' + this.prefs.apiKey;
	var uuid = capturer.uuid;
	var annotationMetadata = capturer.getAnnotationMetadata();
	var htmlContent = capturer.getHtmlContent();
	var doctype = capturer.getDoctype();
	var content = doctype !== null ? doctype + '\n' + htmlContent : htmlContent;
	var capturedImages = capturer.capturedImages;

    var formFields = {};

    $.each(annotationMetadata.annotation, function(key, value) {
		formFields['annotation[' + key + ']'] = value;
    });
	
	// Page
    formFields['capture[page.html]'] = content;

	// Images
	if(capturedImages != null) {
		$.each(capturedImages, function(index, value) {
			var image = value;
            formFields['capture_encoding[' + image.newUrl + ']'] = 'base64';
            formFields['capture[' + image.newUrl + ']'] = image.data;
		});
	}

    // Create a form holding the data to save.
    // Important: Be shure to set the accept-charset to UTF-8
    var $form = $('<form action="' + annotations_url +
            '" method="post" accept-charset="utf-8" id="apiForm"></form>');

    // Populate the form with the form fields to send.
    // The key and value attributes are set using function calls rather than
    // inlining their contents to the html string used for creating the element.
    // When passing the values as function arguments they can contain any
    // characters, and we do not have to worry about proper escaping in the html
    // text.
    var element = null;
    $.each(formFields, function(key, value) {
        $element = $("<input type='text'/>");
        $element.attr('name', key);
        $element.val(value);
        $form.append($element);
    });
	
	$.each(this.prefs.notificationEmails, function(key, value) {
		$element = $("<input type='text'/>");
        $element.attr('name', 'notification_emails[]');
        $element.val(value);
        $form.append($element);
	});

    $form.hide();
    $('body').append($form);

    $form.submit();
};

// (function(){ /* test coverage for JSCoverage */ })();
