/**
 * @constructor
 *
 * Builds the user-interface for capturer, meaning the "i <3 feedback" button
 * and dialogs shown to user
 */
var CaptureUI = function(prefs) {
    this.prefs = prefs;
    
    var loaderIcon = new Image();
    loaderIcon.src = this.prefs.images_url + 'loader.gif';
    
    var successIcon = new Image();
    successIcon.src = prefs.images_url + 'success.png';
    
    var errorIcon = new Image();
    errorIcon.src = prefs.images_url + 'error.png';
    
    this.icons = {
        "LOADER": loaderIcon,
        "SUCCESS": successIcon,
        "ERROR": errorIcon
    };
};

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
};

CaptureUI.prototype.createDialog = function(container) {
    this.$dialog = $('<div id="hannotaatio-status" style="' +
        'font-family: Verdana, Geneva, Arial, Helvetica, ' +
        'sans-serif; font-size: 13px; color: white; ' +
        'background: #3B3B2E url(' + this.prefs.images_url + 'dialogbg.png) ' +
        'repeat-x; border: 3px solid #413337; ' +
        'position: fixed; top: 50%; ' +
        'left: 50%; margin-left: -150px; margin-top: -200px;' +
        'width: 300px; -moz-border-radius: 35px; ' +
        'border-radius: 35px; ' +
        'padding: 20px; z-index: 1000001; text-align:center;' +
        '"><p><img id="hannotaatio-status-image"></p>' + 
        '<div id="hannotaatio-status-message"></div></div>');
    this.$dialog.prependTo($(container)).hide();
}

CaptureUI.prototype.showStatus = function(message, icon) {
    var dialog = this.$dialog;
    if(icon && this.icons[icon] && this.icons[icon].src) {
        dialog.find('#hannotaatio-status-image').attr('src', this.icons[icon].src);
    }
    dialog.find('#hannotaatio-status-message').html(message);
    dialog.fadeIn();
};