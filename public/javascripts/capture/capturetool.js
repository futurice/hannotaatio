
// @URL@

// @CAPTURE_UTILS@

// @PREFERENCES@

// @CAPTURER@

// @UPLOADER@

// @LIB_JSON2@

// @IMAGE_CAPTURER@

$(document).ready(function($){

    /**
     *
     * @constructor
     * @param {object} prefs The prefences for the site to be annotated.
     */
    // This functionality should be wrapped inside a class
    // That creates the Hannotaatio UI to the screen
    
    var prefs = new Preferences(window._hannotaatioPreferences);
    
    /*
    $('<div id="hannotaatio-capture" title="Give feedback on this page"/>').css({
        'width': '73px',
        'height': '57px',
        'position': 'fixed',
        'cursor': 'pointer',
        'top': '-5px',
        'right': '10px',
        'z-index': 1000000,
        'background': 'url(' + prefs.images_url +
        'captureButton_states.png) no-repeat'
    }).hover(function(){
        $(this).css('background-position', '0px -60px');
    }, function(){
        $(this).css('background-position', '');
    }).click(capture).prependTo($(document.body));
    */
    
    var ui = new CaptureUI(prefs);
    ui.createButton(document.body, capture);
    
    // Preload loading spinner
    loaderImg = new Image();
    loaderImg.src = prefs.images_url + 'loader.gif';
    
    function capture(){
        // Notify about ongoing capture
        var dialog = new Dialog(prefs);
        dialog.showStatus('<p>Capturing page...</p>', loaderImg);
        
        setTimeout(function(){
            var capturer = new Capturer($('html'), prefs);
            
            var uploader = new Uploader(prefs);
            
            successImg = new Image();
            successImg.src = prefs.images_url + 'success.png';
            
            errorImg = new Image();
            errorImg.src = prefs.images_url + 'error.png';
            
            var ajaxSuccess = function(status){
                dialog.showStatus('<p style="font-size: 20px">' +
                'Capture successful!</p>' +
                '<p>Redirecting you to the edit page...', successImg);
                // Redirect to annotating page
                setTimeout(function(){
                    window.location = prefs.edit_url + capturer.uuid;
                }, 2000);
            };
            
            var error = function(status){
                var errorString = 'Error: ';
                if (status == 0) {
                    errorString += 'You are probably having cross-domain ' +
                    'issues. Please set up a proxy server.';
                }
                else {
                    errorString += status;
                }
                dialog.showStatus(errorString, errorImg);
            };
            
            // Function for uploading
            var upload = function(){
                if (prefs.uploadMethod == 'form') {
                    dialog.showStatus('<p style="font-size: 20px">' +
                    'Capture successful!</p>' +
                    '<p>Redirecting you to the edit page...', successImg);
                    // Redirect to annotating page
                    // setTimeout(function() {
                    uploader.uploadForm(capturer);
                    // }, 1000);
                }
                else {
                    uploader.uploadAjax(capturer, ajaxSuccess, error);
                }
            };
            
            // Strip <script> tags
            capturer.stripScriptTags();
            
            // Remove capture controls
            capturer.removeCaptureControls();
            
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
            
            // Capture stylesheets
            if (prefs.captureStylesheets) {
                // asynchronous function
                capturer.captureStylesheets(function(){
                    captureImages();
                });
            }
            else {
                captureImages();
            }
            
            
            
            return false;
        }, 1500);
    }
    
    var Dialog = function(prefs){
        this.prefs = prefs;
        this.style = 'font-family: Verdana, Geneva, Arial, Helvetica, ' +
        'sans-serif; font-size: 13px; color: white; ' +
        'background: #3B3B2E url(' +
        prefs.images_url +
        'dialogbg.png) ' +
        'repeat-x; border: 3px solid #413337; ' +
        'position: fixed; top: 50%; ' +
        'left: 50%; margin-left: -150px; margin-top: -200px;' +
        'width: 300px; -moz-border-radius: 35px; ' +
        'border-radius: 35px; ' +
        'padding: 20px; z-index: 1000001; text-align:center;';
        this.init();
    };
    
    Dialog.prototype.init = function(){
        this.element = $('<div id="hannotaatio-status" style="' +
        this.style +
        '">').prependTo($('body')).hide();
    };
    
    Dialog.prototype.showStatus = function(message, image){
        if (image && image.src) {
            message = '<p><img src="' + image.src + '" /></p>' + message;
        }
        
        this.element.html(message);
        this.element.fadeIn();
    };
    
});
