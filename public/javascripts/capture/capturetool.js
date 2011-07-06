
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
    
    var ui = new CaptureUI(prefs);
    ui.createButton(document.body, capture);
    
    // Preload loading spinner
    loaderImg = new Image();
    loaderImg.src = prefs.images_url + 'loader.gif';
    
    function capture(){
        // Notify about ongoing capture
        // var dialog = new Dialog(prefs);
        // dialog.showStatus('<p>Capturing page...</p>', loaderImg);
        ui.createDialog(document.body);
        ui.showStatus('<p>Capturing page...</p>', 'LOADER');
        
        setTimeout(function(){
            var capturer = new Capturer($('html'), prefs);
            var uploader = new Uploader(prefs);
            var ajaxSuccess = function(status){
                ui.showStatus('<p style="font-size: 20px">' +
                'Capture successful!</p>' +
                '<p>Redirecting you to the edit page...', 'SUCCESS');
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
                ui.showStatus(errorString, 'ERROR');
            };
            
            // Function for uploading
            var upload = function(){
                if (prefs.uploadMethod == 'form') {
                    ui.showStatus('<p style="font-size: 20px">' +
                    'Capture successful!</p>' +
                    '<p>Redirecting you to the edit page...', 'SUCCESS');
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
            
            capturer.captureStylesheets(function() {
                captureImages();
            });
            
            return false;
        }, 1500);
    }  
});
