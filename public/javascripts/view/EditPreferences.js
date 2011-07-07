/**
 * Preferences for edit tool
 *
 * @constructor
 * @param {Object} sitePrefs object hash containing preferences
 *                 as key/value pair.
 */
var EditPreferences = function(sitePrefs) {
    if (!sitePrefs) {
        sitePrefs = {};
    }

	/**
	 * Default API domain
	 */
    this.apiDomain = document.domain;
	
	/**
	 * Default API path
	 */
	this.apiPath = "/api/"
	
    /**
     * Defalt publish domain
     */
    this.publishDomain = document.domain;

	/**
	 * Default publish path
	 */
	this.publishPath = "/view/";
	
	/**
	 * Default protocol
	 */
	this.protocol = window.location.protocol;

	/**
	 * Default file storage domain
	 */
	this.fileStorageDomain = "s3-eu-west-1.amazonaws.com";
	
	/**
	 * Default file storage path
	 */
	this.fileStoragePath = "/futurice-hannotaatio-files/";

    // Add (and overwrite if needed) custom preferences
    for (key in sitePrefs) {
		this[key] = sitePrefs[key];
	}
	
	/* Construct URLs */
	
	/**
	 * Constructed read-only API url
	 */
	this.apiUrl = this.protocol + '//' + this.apiDomain + this.apiPath;
	
	/**
	 * Constructed read-only publish url
	 */
	this.publishUrl = this.protocol + '//' + this.publishDomain + this.publishPath; 

	/**
	 * Constructed read-only file storage url
	 */
	this.fileStorageUrl = this.protocol + '//' + this.fileStorageDomain + this.fileStoragePath;

};

// (function(){ /* test coverage for JSCoverage */ })();
