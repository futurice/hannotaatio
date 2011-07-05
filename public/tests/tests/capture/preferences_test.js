$(document).ready(function(){

	module("Preferences.js", {
		setup: function() {
			// Setup		
		}, 
		teardown: function() {
			// Tear down
		}
	});
	
	test("Default values", function() {

		var prefs = new Preferences();
		
	    equals(prefs.captureImages, false, 'captureImages');
	    equals(prefs.captureStylesheets, true, 'captureStylesheets');
		equals(prefs.uploadMethod, 'form', 'uploadMethod');
		equals(prefs.api_path, 'api/', 'api_path');
	    equals(prefs.edit_path, 'view/', 'edit_path');
	    equals(prefs.assets_path, 'capturer/assets/', 'assets_path');
	
		// Following doesn't work with https
		equals(prefs.api_url, 'http://hannotaatio.futurice.com/api/', 'api_url');
	    equals(prefs.edit_url, 'http://hannotaatio.futurice.com/view/', 'edit_url');
	    equals(prefs.assets_url, 'http://hannotaatio.futurice.com/capturer/assets/', 'assets_url');		
    });

	test("All custom values", function() {
		var customPreferences = {
			captureImages: true,
			captureStylesheets: false, 
			uploadMethod: 'ajax',
			api_path: 'api1_0/',
			edit_path: 'view1_0/',
			assets_path: 'capturer/assets1_0/',
			api_url: 'http://hannotaatio-test.futurice.com/api1_0/',
			edit_url: 'http://hannotaatio-test.futurice.com/view1_0/',
			assets_url: 'http://hannotaatio-test.futurice.com/capturer/assets1_0/'
		}
		
		var prefs = new Preferences(customPreferences);
		
	    equals(prefs.captureImages, true, 'captureImages');
	    equals(prefs.captureStylesheets, false, 'captureStylesheets');
		equals(prefs.uploadMethod, 'ajax', 'uploadMethod');
		equals(prefs.api_path, 'api1_0/', 'api_path');
	    equals(prefs.edit_path, 'view1_0/', 'edit_path');
	    equals(prefs.assets_path, 'capturer/assets1_0/', 'assets_path');
	
		// Following doesn't work with https
		equals(prefs.api_url, 'http://hannotaatio-test.futurice.com/api1_0/', 'api_url');
	    equals(prefs.edit_url, 'http://hannotaatio-test.futurice.com/view1_0/', 'edit_url');
	    equals(prefs.assets_url, 'http://hannotaatio-test.futurice.com/capturer/assets1_0/', 'assets_url');
    });

	test("Some custom values", function() {
		var customPreferences = {
			captureImages: true,
			uploadMethod: 'ajax',
			edit_path: 'view1_0/',
			api_url: 'http://hannotaatio-test.futurice.com/api1_0/',
			assets_url: 'http://hannotaatio-test.futurice.com/capturer/assets1_0/'
		}
		
		var prefs = new Preferences(customPreferences);
		
	    equals(prefs.captureImages, true, 'captureImages');
	    equals(prefs.captureStylesheets, true, 'captureStylesheets');
		equals(prefs.uploadMethod, 'ajax', 'uploadMethod');
		equals(prefs.api_path, 'api/', 'api_path');
	    equals(prefs.edit_path, 'view1_0/', 'edit_path');
	    equals(prefs.assets_path, 'capturer/assets/', 'assets_path');
	
		// Following doesn't work with https
		equals(prefs.api_url, 'http://hannotaatio-test.futurice.com/api1_0/', 'api_url');
	    equals(prefs.edit_url, 'http://hannotaatio.futurice.com/view1_0/', 'edit_url');
	    equals(prefs.assets_url, 'http://hannotaatio-test.futurice.com/capturer/assets1_0/', 'assets_url');
    });
});