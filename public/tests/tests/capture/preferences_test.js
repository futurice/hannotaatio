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
	    equals(prefs.images_path, 'images/capture/', 'images_path');
	    equals(prefs.flash_path, 'flash/capture/', 'flash_path');
	
		// Following doesn't work with https
		equals(prefs.api_url, 'http://hannotaatio.futurice.com/api/', 'api_url');
	    equals(prefs.edit_url, 'http://hannotaatio.futurice.com/view/', 'edit_url');
	    equals(prefs.images_url, 'http://hannotaatio.futurice.com/images/capture/', 'images_url');		
	    equals(prefs.flash_url, 'http://hannotaatio.futurice.com/flash/capture/', 'flash_url');		
    });

	test("All custom values", function() {
		var customPreferences = {
			captureImages: true,
			captureStylesheets: false, 
			uploadMethod: 'ajax',
			api_path: 'api1_0/',
			edit_path: 'view1_0/',
			images_path: 'capturer/assets_images/',
			flash_path: 'capturer/assets_flash/',
			api_url: 'http://hannotaatio-test.futurice.com/api1_0/',
			edit_url: 'http://hannotaatio-test.futurice.com/view1_0/',
			images_url: 'http://hannotaatio-test.futurice.com/capturer/assets_images/',
			flash_url: 'http://hannotaatio-test.futurice.com/capturer/assets_flash/'
		}
		
		var prefs = new Preferences(customPreferences);
		
	    equals(prefs.captureImages, true, 'captureImages');
	    equals(prefs.captureStylesheets, false, 'captureStylesheets');
		equals(prefs.uploadMethod, 'ajax', 'uploadMethod');
		equals(prefs.api_path, 'api1_0/', 'api_path');
	    equals(prefs.edit_path, 'view1_0/', 'edit_path');
	    equals(prefs.images_path, 'capturer/assets_images/', 'images_path');
	    equals(prefs.flash_path, 'capturer/assets_flash/', 'flash_path');
	
		// Following doesn't work with https
		equals(prefs.api_url, 'http://hannotaatio-test.futurice.com/api1_0/', 'api_url');
	    equals(prefs.edit_url, 'http://hannotaatio-test.futurice.com/view1_0/', 'edit_url');
	    equals(prefs.images_url, 'http://hannotaatio-test.futurice.com/capturer/assets_images/', 'images_url');
	    equals(prefs.flash_url, 'http://hannotaatio-test.futurice.com/capturer/assets_flash/', 'flash_url');
    });

	test("Some custom values", function() {
		var customPreferences = {
			captureImages: true,
			uploadMethod: 'ajax',
			edit_path: 'view1_0/',
			api_url: 'http://hannotaatio-test.futurice.com/api1_0/',
			images_url: 'http://hannotaatio-test.futurice.com/capturer/assets_images/'
		}
		
		var prefs = new Preferences(customPreferences);
		
	    equals(prefs.captureImages, true, 'captureImages');
	    equals(prefs.captureStylesheets, true, 'captureStylesheets');
		equals(prefs.uploadMethod, 'ajax', 'uploadMethod');
		equals(prefs.api_path, 'api/', 'api_path');
	    equals(prefs.edit_path, 'view1_0/', 'edit_path');
	    equals(prefs.images_path, 'images/capture/', 'images_path');
	
		// Following doesn't work with https
		equals(prefs.api_url, 'http://hannotaatio-test.futurice.com/api1_0/', 'api_url');
	    equals(prefs.edit_url, 'http://hannotaatio.futurice.com/view1_0/', 'edit_url');
	    equals(prefs.images_url, 'http://hannotaatio-test.futurice.com/capturer/assets_images/', 'images_url');
    });
});