// var DOMAIN = document.domain;
// var PROTOCOL = window.location.protocol;
// var API = PROTOCOL + '//' + DOMAIN + '/api/';
// var PUBLISH_URL = PROTOCOL + '//' + DOMAIN + '/view/';

// Color themes
var themeColors = {
    light: {
        arrowColor: '#e1e3d1',
        boxColor: '#e1e3d1',
        textColor: '#e1e3d1',
        pointStroke: '#666',
        pointFill: '#fff',
        textBackground: '#000'
    },
    dark: {
        arrowColor: '#3B3B2E',
        boxColor: '#3B3B2E',
        textColor: '#3B3B2E',
        pointStroke: '#666',
        pointFill: '#fff',
        textBackground: '#fff'
    }
};

var API, PUBLISH_URL;

jQuery(document).ready(function($) {
	
	// @PREFERENCES@
	
	var prefs = new EditPreferences(window._hannotaatioPreferences);
	
	API = prefs.apiUrl;
	PUBLISH_URL = prefs.publishUrl;

    // @UTILS@

    var utils = new Utils();

    // @ARROW@

    // @BOX@

    // @TEXT@

    // @AJAX@

    var ajaxLoader = new Ajax();
    var ajaxSaver = new Ajax();

    // Extract uuid from site url, warn upon failure
    var uuid = utils.getUUIDFromUrl(window.location.href);
    if (!uuid) {
        alert('UUID not set! Using local testcapture.');
    }

    // @UI@

    var ui = new UI(uuid, ajaxSaver, prefs);

    // Load annotation info and delegate callbacks (success, error)
    ajaxLoader.loadInfo(
        uuid,
        function(info) {
            ui.setInfo(info);
            ui.init();
        }, function() {
            log('Loading of info failed');
            $('#loading-text').html('');
        }
    );

    // Load annotations and delegate callbacks by passing reference to UI
    ajaxLoader.loadAnnotations(
        uuid,
        function(data) {
            ui.setJson(data);
            ui.init();
        }, function() {
            log('Loading of annotations failed');
            $('#loading-text').html('');
        }
    );
});
