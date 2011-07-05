/**
 * Preferences for capture tool
 *
 * @constructor
 * @param {Object} sitePrefs object hash containing preferences
 *                 as key/value pair.
 */
var Preferences = function(sitePrefs) {
    if (!sitePrefs) {
        sitePrefs = {};
    }

    /**
     * Load the images and encode them to URI scheme base64
     * (URLs taken from the DOM tree) and send them to backend.
     * https://www.pivotaltracker.com/story/show/5827786
     */
    this.captureImages = false;

    /**
     * crossdomain.xml available
	 */
    this.crossDomainFileAvailable = false;

    /**
     * Capture the styles and send embed them to the DOM tree
     * using the <style> tags
     */
    this.captureStylesheets = true;

    /**
     * Is the page captured using AJAX or a Form based approach. Use the
     * strings "ajax" or "form".
     */
    this.uploadMethod = 'form';

    /**
     * Collect email addresses where notifications are sent and
     * send them to the backend.
     * https://www.pivotaltracker.com/story/show/5828099
     */
    this.notificationEmails = [];

    /**
     * Site preferences.
     */
    this.site = {
        name: 'http://www.example.com',
        version: 1.0
    };
	
	/**
	 * Default api key
	 */
	this.apiKey = "1000000000000000000000000000000000000000";

    /**
     * Resource paths under the hannotaatio domain. All paths must end with a
     * slash '/'.
     *
     * It might be possible that you want to use a path at the domain root, for
     * instance if you are using the development server on your localhost:8000,
     * and the API uses URLs as http://localhost:8000/xxxx/. In this case you
     * should set api_path as the empty string.
     */
    this.api_path = 'api/';
    this.edit_path = 'view/';
    this.images_path = 'images/capture/';
    this.flash_path = 'flash/capture/';

    /**
     * Hannotaatio service main domain. The name must end with a slash '/'.
     * Examples:
     * http://hannotaatio.futurice.com/ or https://hannotaatio.futurice.com
     * http://localhost:8000/
     */
    this.hannotaatio_domain = window.location.protocol + '//' + document.domain + ':' + window.location.port + '/';

    // Add (and overwrite if needed) custom preferences
    for (key in sitePrefs) {
		this[key] = sitePrefs[key];
	}

    // If URLs are not set by custom preferences,
    // let's construct them from domain and path
    if (!this.api_url) {
        this.api_url = this.hannotaatio_domain + this.api_path;
    }

    if (!this.edit_url) {
        this.edit_url = this.hannotaatio_domain + this.edit_path;
    }
    
    if(!this.images_url) {
        this.images_url = this.hannotaatio_domain + this.images_path;
    }
    
    if(!this.flash_url) {
        this.flash_url = this.hannotaatio_domain + this.flash_path;
    }

};

// (function(){ /* test coverage for JSCoverage */ })();
