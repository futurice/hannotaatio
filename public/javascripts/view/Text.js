/**
 * Text.
 *
 * @constructor
 *
 * @param {object} canvas Raphael canvas.
 * @param {object} colors Color theme.
 * @param {number} x x value.
 * @param {number} y y value.
 * @param {string} string The text to be added.
 */
var Text = function(canvas, colors, x, y, string, htmlContainer, ui) {
    this.canvas = canvas;
    this.container = htmlContainer;
    this.ui = ui;

    // Store color theme used in drawing
    this.colors = colors;

    // Define text attributes
    this.textFontSize = 25;
    this.textColor = colors.textColor;
    this.textFontWeight = 'bold';
    
    var initialString = string ? string : ' ';

    this.drawing = canvas.text(x, y, initialString).attr({
        'font-size': this.textFontSize,
        'fill': this.textColor,
        'font-weight': this.textFontWeight,
        'text-anchor' : 'start'
    });

	// If no string is set, go to editing mode
    if (!string) {
        this.edit();
    }
};

Text.prototype.edit = function(callback) {
    // Hide the Raphael drawing
    this.drawing.hide();

    // Create and show a textarea for editing
    this.editElement = $('<textarea>' + this.drawing.attr('text') +
            '</textarea>')
        .css({
              left: this.drawing.attr('x'),
              top: this.drawing.attr('y'),
              color: this.textColor,
              'font-weight': this.textFontWeight,
              'font-size': this.textFontSize,
              background: this.colors.textBackground
            })
        .appendTo(this.container)
        .focus();

    // Add event handler for ending the editing
    var text = this;
    this.editElement.bind('blur', function() {
        text.setString(this.value);
        $(text.editElement).remove();
        text.drawing.show();

        // Save to JSON
        text.ui.saveToJSON(text);
    });
};

Text.prototype.makeEditable = function() {
    var text = this;
    this.drawing.dblclick(function() {
        text.edit();
    }).attr('title','Doubleclick to edit');
};

Text.prototype.makeDraggable = function(callback) {
    var text = this;

    var start = function() {
		if (!text.ui.isDraggable) { return; }
		
        // Store original coordinates
        this.ox = this.attr('x');
        this.oy = this.attr('y');
        // Visually indicate dragging
        this.attr({ opacity: 0.5 });
		
		this.isDragging = true;
        text.ui.setDragCursor();
		text.ui.disableDragging();
    }; 
	
    var move = function(dx, dy) {
		if(!this.isDragging) { return; }
		
        // Update text coordinates
        this.attr({ x: this.ox + dx, y: this.oy + dy });
    };
	
    var saveChanges = function() {
        if (text.ui.mouseOverDelete) {
            // Remove from JSON
            text.ui.removeFromJSON(text);
            // Remove drawing
            text.remove();
            delete text;
            // Visualize deletion
            text.ui.animateTrash();
            text.ui.restoreDefaultCursor();
        }
        else {
            // Save to JSON
            text.ui.saveToJSON(text);
            // Restore visual state
            this.attr({
                opacity: 1.0
            });
        }
        text.ui.restoreDefaultCursor();
		text.ui.enableDragging();
		this.isDragging = false;
    };
    this.getDrawing().drag(move, start, saveChanges);
};

/**
 * Returns text as a JSON representation.
 *
 * @return {object} JSON object.
 */
Text.prototype.generateJSON = function() {
    var json = {
        'type': 'text',
        'colors': this.colors,
        'x': this.drawing.attr('x'),
        'y': this.drawing.attr('y'),
        'string': this.drawing.attr('text')
    };
    return json;
};

Text.prototype.remove = function() {
    this.drawing.remove();
};

/**
 * Returns the text Raphael object.
 *
 * @return {object} Text Raphael object.
 */
Text.prototype.getDrawing = function() {
    return this.drawing;
};

/**
 * Returns the content of the text element as string.
 *
 * @return {string} Content of the text element.
 */
Text.prototype.getString = function() {
    return this.drawing.attr('text');
};

/**
 * Sets the content for the text element.
 *
 * @param {string} string Text content.
 */
Text.prototype.setString = function(string) {
    this.drawing.attr({
        'text': string
    });
};

// (function(){ /* test coverage for JSCoverage */ })();
