/**
 * Ajax functionalities
 *
 * @constructor
 */
var Ajax = function() {

};

/**
 * Load annotations.
 *
 * @param {string} uuid The UUID of the annotation.
 * @param {function()} successCallback Callback for succesful respone.
 * @param {function()} errorCallback Callback for error respone.
 */
Ajax.prototype.loadAnnotations = function(uuid, successCallback,
        errorCallback) {
    $.ajax({
        url: API + 'annotations/' + uuid + '/annotations.json',
        dataType: 'json',
        method: 'GET',
        error: errorCallback,
        success: successCallback
    });
};

/**
 * Load general info annotations.
 *
 * @param {string} uuid The UUID of the annotation.
 * @param {function()} successCallback Callback for succesful respone.
 * @param {function()} errorCallback Callback for error respone.
 */
Ajax.prototype.loadInfo = function(uuid, successCallback,
        errorCallback) {
    $.ajax({
        url: API + 'annotations/' + uuid + '.json',
        dataType: 'json',
        method: 'GET',
        error: errorCallback,
        success: successCallback
    });
};

/**
 * Save annotations.
 *
 * @param {string} uuid The UUID of the annotation.
 * @param {object} json JSON object to be saved to the server.
 * @param {function()} successCallback Callback for succesful respone.
 * @param {function()} errorCallback Callback for error respone.
 */
Ajax.prototype.saveAnnotations = function(uuid, json, successCallback,
        errorCallback) {
    $.ajax({
        type: 'POST',
        url: API + 'annotations/' + uuid + '/annotations',
        data: HannotaatioJSON.stringify(json),
        complete: function(request, status) {
            if (request.status == 201) {
                successCallback();
            } else {
                errorCallback();
            }
        },
        dataType: 'json'
    });
};

/**
 * Delete annotations.
 *
 * @param {string} uuid The UUID of the annotation.
 * @param {function()} successCallback Callback for succesful respone.
 * @param {function()} errorCallback Callback for error respone.
 */
Ajax.prototype.deleteAnnotations = function(uuid, successCallback,
        errorCallback) {
    $.post(API + 'annotations/' + uuid, { _method: 'delete' },
            function(data, textStatus) {
        if (textStatus == 'success') {
                log('Annotation deleted.');
                successCallback();
        } else {
                log('Failed to delete Annotation: ' + data);
                errorCallback();
        }
    });
};
