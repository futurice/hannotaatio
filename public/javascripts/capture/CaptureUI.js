/**
 * @constructor
 *
 * Builds the user-interface for capturer, meaning the "i <3 feedback" button
 * and dialogs shown to user
 */
var CaptureUI = function(prefs) {
    this.prefs = prefs
}

/**
 * Creates the "i <3 feedback" button and initializes
 * mouse listeners
 */
CaptureUI.prototype.createButton = function(container, clickHandler) {
    $('<div id="hannotaatio-capture" title="Give feedback on this page"/>').css({
        'width': '73px',
        'height': '57px',
        'position': 'fixed',
        'cursor': 'pointer',
        'top': '-5px',
        'right': '10px',
        'z-index': 1000000,
        'background': 'url(' + this.prefs.images_url +
        'captureButton_states.png) no-repeat'
    }).hover(function(){
        $(this).css('background-position', '0px -60px');
    }, function(){
        $(this).css('background-position', '');
    }).click(clickHandler).prependTo($(container));
}