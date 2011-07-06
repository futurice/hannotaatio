
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
    ui.createButton(document.body, function() {

        // Notify about ongoing capture
        ui.createDialog(document.body);
        ui.showStatus('<p>Capturing page...</p>', 'LOADER');
        
        var capturer = new Capturer($('html'), prefs);
        var uploader = new Uploader(prefs);
        
        setTimeout(function(){
            
            // Strip <script> tags
            capturer.stripScriptTags();
            
            // Remove capture controls
            capturer.removeCaptureControls();
            
            capturer.captureStylesheets(function() {
                capturer.captureImages(function() {
                    ui.showStatus('<p style="font-size: 20px">' +
                    'Capture successful!</p>' +
                    '<p>Redirecting you to the edit page...', 'SUCCESS');
                    uploader.uploadForm(capturer);
                });
            });
            
            return false;
        }, 1000);
    });
});
