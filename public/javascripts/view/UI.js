/**
 * UI functionalities.
 *
 * @constructor
 *
 * @param {string} uuid UUID of the annotation.
 * @param {Ajax} ajax The Ajax helper class.
 */
var UI = function(uuid, ajax, prefs) {
    this.uuid = uuid;
    this.ajax = ajax;
    this.json = null;
    this.info = null;

    this.mouseOverDelete = false; // Store whether mouse is over "trash"

    this.colors = {};
	
	// Drawings are draggable by default but when creating a new drawing the
	// existing drawings on the canvas are not draggable
	this.enableDragging();

    // Default drawing colors
    this.setColors('dark');

    // Set URL of iframe to load captured DOM tree
    this.setIframeURL(prefs.fileStorageUrl, uuid);
};

/**
 * Handles the mode switching between annotating and viewing
 * (while first checking whether info is already set)
 */
UI.prototype.init = function() {

    if (this.json && this.info) {

        // Set canvas size in DOM tree
        this.setCanvasSize();

        // Switch mode according to whether there is data
        if (this.json.annotations) {
            this.view();
        } else {
            this.annotate();
        }
    }
};

/**
 * Animates the trash bin when deleting something
 */
UI.prototype.animateTrash = function() {
    $('#delete').effect('bounce', {direction: 'left', distance: 15, times: 3},
            'fast');
};

/**
 * Enables annotation mode (drawing and adding text)
 */
UI.prototype.annotate = function() {

    var ui = this;
    log('ui.annotate');

    // Set up canvas for Hannotations
    var canvas = Raphael('hannotation-canvas');

    // Removing "Loading" text from toolbar
    $('#loading-text').remove();

    // Set up JSON for annotating
    this.json = {
        annotations: []
    };

    // Create light/dark switcher
    var $switcherButton = $("<div class='button' " +
            "id='switcher-button' title='Click to switch to light colors'></div>");
    $switcherButton
        .click(function() {
            $(this).toggleClass("light");
            
            if ($(this).hasClass("light")) {
                ui.setColors("light");
                $(this).attr('title', 'Click to switch to dark colors');
            } else {
                ui.setColors("dark");
                $(this).attr('title', 'Click to switch to light colors');
            }
        })
        .appendTo('#hannotation-toolbar-color-switcher');
    
    // Adding of arrows
    $("<div class='button' id='add_arrow' title='Add arrow'></div>")
        .appendTo('#hannotation-toolbar-drawing-tools').click(function() {

        // Reset mousedown event handlers attached to canvas
        $('#hannotation-canvas').unbind('mousedown').unbind('click');
		
		ui.disableDragging();

        // Reset button states to normal
        ui.resetToolButtonStates();

        // Make arrow button appear pressed
        $(this).addClass('pressed');

        // Draw an arrow by dragging the mouse
        $('#hannotation-canvas').css('cursor', 'crosshair')
            .mousedown(function(mdEvent) {

            // Reset cursor to default
            $(this).css('cursor', 'default');

            // Store start position of mouse drawing
            var startPos = {
                x: mdEvent.pageX - $(this).offset().left,
                y: mdEvent.pageY - $(this).offset().top
            };

            // Draw zero-length arrow at start position that is later rescaled
            var arrow = new Arrow(canvas, ui.colors, startPos.x, startPos.y,
                    startPos.x, startPos.y);

            var endX;
            var endY;

            $(this).mousemove(function(mmEvent) {
                endX = mmEvent.pageX - $(this).offset().left;
                endY = mmEvent.pageY - $(this).offset().top;
                arrow.update(startPos.x, startPos.y, endX, endY);
            });

            $(this).mouseup(function(muEvent) {
                // Remove arrow again if tail is shorter than head
                if (arrow.tooShort()) {
                    arrow.remove();
                    delete arrow;
                }
                $(this).unbind('mousemove');
                $(this).unbind('mouseup');

                // Save arrow to JSON
                ui.saveToJSON(arrow);

                // Reset button states to normal
                ui.resetToolButtonStates();
				
				ui.enableDragging();
            });

            // Remove handler after drawing arrow
            $(this).unbind('mousedown');

            // Make arrow draggable

            var headPoint = arrow.getHeadPoint();
            var tailPoint = arrow.getTailPoint();
            var head = arrow.getHead();
            var tail = arrow.getTail();

            arrow.getDrawing().hover(function(e) {
                if(!ui.isDraggable) {return; }
				
				// Style dragging cursors
            	headPoint.node.style.cursor = 'ne-resize';
            	tailPoint.node.style.cursor = 'ne-resize';
            	head.node.style.cursor = 'move';
            	tail.node.style.cursor = 'move';
				
				headPoint.show();
                tailPoint.show();
            });

            arrow.getDrawing().mouseout(function(e) {
                headPoint.hide();
                tailPoint.hide();
				
				// Style dragging cursors
            	headPoint.node.style.cursor = null;
            	tailPoint.node.style.cursor = null;
            	head.node.style.cursor = null;
            	tail.node.style.cursor = null;
            });

            var startPoint = function() {
				if (!ui.isDraggable) { return; }
				
                // Store original coordinates
                this.ox = this.attr('cx');
                this.oy = this.attr('cy');
				
				ui.disableDragging();
				this.isDragging = true;
            };
            var movePoint = function(dx, dy) {
				if(!this.isDragging) { return; }
				
                // Update point coordinates, then arrow itself
                this.attr({cx: this.ox + dx, cy: this.oy + dy});
                arrow.update(tailPoint.attr('cx'), tailPoint.attr('cy'),
                        headPoint.attr('cx'), headPoint.attr('cy'));
            };
            var startWhole = function() {
				if (!ui.isDraggable) { return; }
				
                // Store original coordinates
                this.ox1 = tailPoint.attr('cx');
                this.oy1 = tailPoint.attr('cy');
                this.ox2 = headPoint.attr('cx');
                this.oy2 = headPoint.attr('cy');
                // Visually indicate dragging
                head.attr({opacity: 0.5});
                tail.attr({opacity: 0.5});
                ui.setDragCursor();
				
				ui.disableDragging();
				this.isDragging = true;
            };
            var moveWhole = function(dx, dy) {
				if(!this.isDragging) { return; }
				
                // Update point coordinates, then arrow itself
                arrow.update(this.ox1 + dx, this.oy1 + dy,
                        this.ox2 + dx, this.oy2 + dy);
            };
            var saveChanges = function() {
				if(!this.isDragging) { return; }
				
                if (ui.mouseOverDelete) {
                    // Remove from JSON
                    ui.removeFromJSON(arrow);
                    // Remove drawing
                    arrow.remove();
                    delete arrow;
                    // Visualize deletion
                    ui.animateTrash();
                } else {
                    // Save changes to JSON
                    ui.saveToJSON(arrow);
                    // Restore visual state
                    head.attr({opacity: 1.0});
                    tail.attr({opacity: 1.0});
                }
                ui.restoreDefaultCursor();
				ui.enableDragging();
				this.isDragging = false;
            };

            headPoint.drag(movePoint, startPoint, saveChanges);
            tailPoint.drag(movePoint, startPoint, saveChanges);
            head.drag(moveWhole, startWhole, saveChanges);
            tail.drag(moveWhole, startWhole, saveChanges);
        });
    });

    // Adding of boxes
    $("<div class='button' id='add_box' title='Add box'></div>")
        .appendTo('#hannotation-toolbar-drawing-tools').click(function() {

        // Reset mousedown event handlers attached to canvas
        $('#hannotation-canvas').unbind('mousedown').unbind('click');

		ui.disableDragging();

        // Reset button states to normal
        ui.resetToolButtonStates();

        // Make box button appear pressed
        $(this).addClass('pressed');

        // Draw a box by dragging the mouse
        $('#hannotation-canvas').css('cursor', 'crosshair')
            .mousedown(function(mdEvent) {

            var startPos = {
                x: mdEvent.pageX - $(this).offset().left,
                y: mdEvent.pageY - $(this).offset().top
            };
            var box = new Box(canvas, ui.colors, startPos.x, startPos.y, 0, 0);

            $(this).mousemove(function(mmEvent) {
                box.update(startPos.x, startPos.y,
                    (mmEvent.pageX - $(this).offset().left),
                    (mmEvent.pageY - $(this).offset().top)
                );
            });

            $(this).mouseup(function(muEvent) {
                // Remove box again if too small
                if (box.tooSmall()) {
                    box.remove();
                    delete box;
                }

                $(this).unbind('mousemove');
                $(this).unbind('mouseup');
                $(this).css('cursor', 'default');

                // Save box to JSON
                ui.saveToJSON(box);

                // Reset button states to normal
                ui.resetToolButtonStates();
				
				ui.enableDragging();
            });

            // Remove handler after drawing box
            $(this).unbind('mousedown');

            // Make box draggable

            var rect = box.getRect();
            var nwPoint = box.getNwPoint();
            var nePoint = box.getNePoint();
            var sePoint = box.getSePoint();
            var swPoint = box.getSwPoint();

			var showHandles = function() {
				if(!ui.isDraggable) {return; }
				
				// Style dragging cursors
            	rect.node.style.cursor = 'move';
            	nwPoint.node.style.cursor = 'nw-resize';
            	nePoint.node.style.cursor = 'ne-resize';
            	sePoint.node.style.cursor = 'se-resize';
            	swPoint.node.style.cursor = 'sw-resize';
				
                nwPoint.show();
                nePoint.show();
                sePoint.show();
                swPoint.show();
			}

            box.getDrawing().mouseover(function(e) {
				showHandles();
            });
			
			box.getDrawing().mousemove(function(e) {
				showHandles();
            });

            box.getDrawing().mouseout(function(e) {
				
				// Style dragging cursors
            	rect.node.style.cursor = null;
            	nwPoint.node.style.cursor = null;
            	nePoint.node.style.cursor = null;
            	sePoint.node.style.cursor = null;
            	swPoint.node.style.cursor = null;
				
                nwPoint.hide();
                nePoint.hide();
                sePoint.hide();
                swPoint.hide();
            });

            var startPoint = function() {
				if (!ui.isDraggable) { return; }
				
                // Store original coordinates
                this.ox = this.attr('cx');
                this.oy = this.attr('cy');
				
				this.isDragging = true;
				ui.disableDragging();
            };

			var moveNwSePoint = function(dx, dy) {
                if(!this.isDragging) { return; }
				
				// Update point coordinates, then box itself
                this.attr({cx: this.ox + dx, cy: this.oy + dy});
                box.update(
                    nwPoint.attr('cx'),
                    nwPoint.attr('cy'),
                    sePoint.attr('cx'),
                    sePoint.attr('cy')
                );
            };

            var moveNeSwPoint = function(dx, dy) {
				if(!this.isDragging) { return; }
						
                // Update point coordinates, then box itself
                this.attr({cx: this.ox + dx, cy: this.oy + dy});
                box.update(
                    nePoint.attr('cx'),
                    nePoint.attr('cy'),
                    swPoint.attr('cx'),
                    swPoint.attr('cy')
                );
            };
            var startWhole = function() {
				if (!ui.isDraggable) { return; }
				
                // Store original coordinates
                this.ox = this.attr('x');
                this.oy = this.attr('y');
                // Visually indicate dragging
                this.attr({opacity: 0.5});
                ui.setDragCursor();
				
				ui.disableDragging();
				this.isDragging = true;
            };
            var moveWhole = function(dx, dy) {
				if(!this.isDragging) { return; }
				
                // Update box coordinates
                box.update(
                    this.ox + dx,
                    this.oy + dy,
                    this.ox + this.attr('width') + dx,
                    this.oy + this.attr('height') + dy
                );
            };
            var saveChanges = function() {
				if(!this.isDragging) { return; }
				
                if (ui.mouseOverDelete) {
                    // Remove from JSON
                    ui.removeFromJSON(box);
                    // Remove drawing
                    box.remove();
                    delete box;
                    // Visualize deletion
                    ui.animateTrash();
                } else {
                    // Save to JSON
                    ui.saveToJSON(box);
                    // Restore visual state
                    if (this === rect) {
                        this.attr({opacity: 1.0});
                    }
                }
                ui.restoreDefaultCursor();
				ui.enableDragging();
				this.isDragging = false;
            };
            rect.drag(moveWhole, startWhole, saveChanges);
            nwPoint.drag(moveNwSePoint, startPoint, saveChanges);
            nePoint.drag(moveNeSwPoint, startPoint, saveChanges);
            sePoint.drag(moveNwSePoint, startPoint, saveChanges);
            swPoint.drag(moveNeSwPoint, startPoint, saveChanges);
        });
    });

    // Adding of text
    $("<div class='button' id='add_text' title='Add text'></div>")
        .appendTo('#hannotation-toolbar-drawing-tools').click(function() {

        // Reset mousedown event handlers attached to canvas
        $('#hannotation-canvas').unbind('mousedown').unbind('click');

		ui.disableDragging();

        // Reset button states to normal
        ui.resetToolButtonStates();

        // Make text button appear pressed
        $(this).addClass('pressed');

        $('#hannotation-canvas').css('cursor', 'text').click(function(e) {

            // Remove handler immediately after adding text
            $(this).unbind('click').css('cursor', 'default');

            // Add text to canvas
            var text = new Text(
                canvas,
                ui.colors,
                e.pageX - $(this).offset().left,
                e.pageY - $(this).offset().top,
                null,
                '#hannotation-canvas',
                ui
            );

            // Reset button states to normal
            ui.resetToolButtonStates();
			
			ui.enableDragging();

            text.makeEditable();

            // Make text draggable
            text.makeDraggable(function() {
                log('Saving dragged text');
                ui.saveToJSON(text);
			});
			
			text.getDrawing().hover(function(e) {
				if(!ui.isDraggable) {return; }
				
				// Style dragging cursors
    			this.node.style.cursor = 'move';
            });

            text.getDrawing().mouseout(function(e) {
				// Style dragging cursors
    			this.node.style.cursor = null;
            });
        });
    });

    // Enable deleting of annotations
    $("<div id='delete' title='Drag annotation here to delete'></div>")
        .appendTo('#hannotation-toolbar-content')
        .hover(
            function() {
                ui.mouseOverDelete = true;
                $(this).addClass('hover');
            },
            function() {
                ui.mouseOverDelete = false;
                $(this).removeClass('hover');
            }
        );

    // Enable publishing of annotations
    $("<div class='button' id='save' title='Save and publish your " +
        "comments'></div>")
        .appendTo('#hannotation-toolbar-content')
        .mousedown(function() {
            $(this).addClass('pressed');
        })
        .mouseout(function() {
            $(this).removeClass('pressed');
        })
        .click(function() {
            ui.publish();
            // Stay pressed even if mouse is moved now
            $(this).unbind('mouseout');
        });
};

UI.prototype.disableDragging = function() {
	this.isDraggable = false;
	$('div#hannotation-canvas').addClass('unselectable');
}

UI.prototype.enableDragging = function() {
	this.isDraggable = true;
	$('div#hannotation-canvas').removeClass('unselectable');
}

/**
 * Publish button clicked
 */
UI.prototype.publish = function() {

    var ui = this;

    var successCallback = function() {
        var url = PUBLISH_URL + ui.uuid;
        ui.showDialogWindow(
            '<h1>Annotation saved!</h1>' +
            '<p>Copy and share this link to show others your feedback:</p>' +
            '<p><input type="text" value="' + url + '" style="width: 100%;" /></p>',
            function() {
                window.location = url;
            }
        );
        // Reset publish button state
        $("#save").removeClass('pressed');
    }

    var errorCallback = function() {
        this.showDialogWindow('<h1>Sorry!</h1>' +
            '<p>Your feedback could not be saved because this ' +
            'page could not connect to our API.</p>' +
            '<p>Please try again!</p>'
        );
        // Reset publish button state
        $("#save").removeClass('pressed');
    }

    this.ajax.saveAnnotations(this.uuid, this.json, successCallback,
            errorCallback);
};

/**
 *
 * Remove UUID with its contents.
 */
UI.prototype.remove = function() {
    var ui = this;
    var url = this.info.annotation.captured_url;

    var successCallback = function() {
        ui.showDialogWindow(
            '<h1>Your feedback was deleted from our service!</h1>' +
            '<p>Click on "Close" to be redirected to the original page.</p>',
            function() {
                    window.location = url;
            }
        );
    }

    var errorCallback = function() {
        ui.showDialogWindow('<h1>Sorry!</h1>' +
            '<p>Your feedback couldn\'t be deleted due to a problem with ' +
            'the connection to our service.</p' +
            '<p>Please try again!</p>'
        );
    }

    ui.showConfirmWindow(
        '<h1>You are about to permanently delete your feedback!</h1>' +
            '<p>Are you sure?</p>',
        function() {
                log('Sending delete hannotation request!');
                ui.ajax.deleteAnnotations(ui.uuid, successCallback,
                        errorCallback);
        },
        function() {
                log('Delete request canceled!');
        }
    );
};

/**
 * Remove object data from JSON
 *
 * @param {object} object JSON object to be removed.
 */
UI.prototype.removeFromJSON = function(object) {
    delete this.json.annotations[object.jsonId - 1];
};

/**
 * Reset all buttons in color switcher to normal (non-pressed) state
 */
UI.prototype.resetColorButtonStates = function() {
    $('#hannotation-toolbar-color-switcher div').removeClass('pressed');
};

/**
 * Reset all drawing tool buttons in toolbar to normal (non-pressed) state
 */
UI.prototype.resetToolButtonStates = function() {
    $('#hannotation-toolbar-drawing-tools div').removeClass('pressed');
};

/**
 * Add or update object data to JSON.
 *
 * @param {object} object JSON object to be added/updated.
 */
UI.prototype.saveToJSON = function(object) {
    if (!object.jsonId) {
        // Add
        object.jsonId = this.json.annotations.push(object.generateJSON());
    } else {
        // Update
        this.json.annotations[object.jsonId - 1] = object.generateJSON();
    }
};

/**
 * Loads the captured page into <iframe>.
 *
 * @param {string} uuid Hannotation UUID.
 */
UI.prototype.setIframeURL = function(fileStorageUrl, uuid) {
    if (uuid) {
        // Load captured page
        var url = fileStorageUrl + uuid + '/page.html';
    } else {
        // Load test page into iframe
        url = 'testcapture/index.html';
    }

    // Set iframe source attribute
    $('#capture').attr('src', url);
};

/**
 * Store loaded data into local variable.
 *
 * @param {object} data JSON data.
 */
UI.prototype.setJson = function(data) {
    log('ui.setJson');

    // Set up JSON variable to be filled with annotations
    if (data) {
        this.json = data;
    } else {
        this.json = {};
    }
};

/**
 * Sets up Hannotation info box (browser used, dimensions etc.).
 *
 * @param {object} info JSON data.
 */
UI.prototype.setInfo = function(info) {
    var utils = new Utils();
    log('ui.setInfo');

    if (info) {
        this.info = info;
    }
};

/**
 * Sets info text (capturing time, browser) in the DOM tree
 */
UI.prototype.printInfo = function() {
    var utils = new Utils();

    var origin = this.info.annotation.captured_url;
    var date = this.info.annotation.created_at;
    var browser = this.info.annotation.browser;

    // Format browser data to a nice string
    var browserTidy = utils.detectBrowserOS(browser);

    // Dirty regex way of converting RoR date to JS date object
    x = date.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    date = new Date(x[1], x[2], x[3], x[4], x[5], x[6]);

    // Format date to a simple string output
    var dateString = utils.dateToString(date);

    $('#hannotation-toolbar-content').append(
        '<div id="hannotation-toolbar-info"><dl>' +
        '<dt>Captured</dt><dd><acronym title="' + date +
        '">' + dateString + '</acronym></dd>' +
        '<dt>Browser</dt><dd><acronym title="' + browser +
        '">' + browserTidy + '</acronym></dd>' +
        '</dl></div>'
    );
};

/**
 * Restore the default cursor for toolbar and canvas (does not affect
 * buttons etc.)
 */
UI.prototype.restoreDefaultCursor = function() {
    $('#hannotation-toolbar, #hannotation-canvas').css('cursor', 'default');
};

/**
 * Sets canvas & iframe size in the DOM tree
 */
UI.prototype.setCanvasSize = function() {
    var height = Math.round(this.info.annotation.body_height);
    var width = Math.round(this.info.annotation.body_width);

    $('iframe#capture').css('height', height);
    $('div#hannotation-canvas').css('height', height);
    $('iframe#capture').css('width', width);
    $('div#hannotation-canvas').css('width', width);
    $('div#hannotation-page').css('height', height);
    $('div#hannotation-page').css('width', width);
};

/**
 * Loads and sets the UI colors based on theme name.
 *
 * Currently available themes: 'dark', 'light'
 *
 * @param {string} theme Theme name.
 */
UI.prototype.setColors = function(theme) {
    this.colors = themeColors[theme];
};

/**
 * Sets the cursor for toolbar and canvas when dragging elements (does not
 * affect buttons etc.)
 */
UI.prototype.setDragCursor = function() {
    $('#hannotation-toolbar, #hannotation-canvas').css('cursor', 'move');
};

/**
 * Displays the overlay dialog window
 * @param {string} htmlContent
 * @param {object} callback
 */
UI.prototype.showDialogWindow = function(htmlContent, callback) {
    $('<div id="hannotation-dialog">')
        .html(htmlContent + '<div id="dialog-close"></div>')
        .hide()
        .prependTo($('body'))
        .fadeIn();

    $('#dialog-close').attr('title', 'Close').click(function() {
        $('#hannotation-dialog').remove();
        if (typeof callback == 'function') {
            callback();
        }
    });
};

/**
 * Displays the overlay confirmation window
 * @param {string} htmlContent
 * @param {object} callbackConfirm
 * @param {object} callbackCancel
 *
 */
UI.prototype.showConfirmWindow = function(htmlContent, confirmCallback,
        cancelCallback) {
    $('<div id="hannotation-dialog">')
        .html(htmlContent + '<div id="dialog-confirm"></div>' +
                '<div id="dialog-cancel"></div>')
        .hide()
        .prependTo($('body'))
        .fadeIn();

    $('#dialog-confirm').attr('title', 'Yes').click(function() {
        $('#hannotation-dialog').remove();
        if (typeof confirmCallback == 'function') {
            confirmCallback();
        }
    });
    $('#dialog-cancel').attr('title', 'No').click(function() {
        $('#hannotation-dialog').remove();
        if (typeof cancelCallback == 'function') {
            cancelCallback();
        }
    });
};

/**
 * Enables viewing mode (looking at published annotations)
 */
UI.prototype.view = function() {

    log('ui.view');
    var ui = this;
    
    var origin = this.info.annotation.captured_url;

    // Set up canvas for Hannotations
    var canvas = Raphael('hannotation-canvas');
    
    // Empty toolbar
    $('#hannotation-toolbar-content').html('');
    
    // Add hannotation remove/delete button to the UI
    $("<div class='button' id='remove' title='Remove your comments " +
            "completely from our server'></div>")
            .appendTo('#hannotation-toolbar-content').click(function() {
                ui.remove();
    });
    
    // Add "go to original page" button
    $("<div class='button' id='back-to-original' title='Go back to the original page'></div>")
        .appendTo('#hannotation-toolbar-content').click(function() {
            window.location = origin;
        });

    // Set capture info (timestamp, browser)
    this.printInfo();
    
    var defaultColors = this.colors;

    $(this.json.annotations).each(function(key, value) {
        // Skip null values (deleted annotations)
        if (value) {
        	if(!value.colors){
        		value.colors = defaultColors;
        	}
            switch (value.type) {
                case 'arrow':
                    var arrow = new Arrow(
                        canvas,
                        value.colors,
                        value.tailX,
                        value.tailY,
                        value.headX,
                        value.headY
                    );
                    break;
                case 'rect':
                    var box = new Box(
                        canvas,
                        value.colors,
                        value.x,
                        value.y,
                        value.width,
                        value.height
                    );
                    break;
                case 'text':
                    var text = new Text(
                        canvas,
                        value.colors,
                        value.x,
                        value.y,
                        value.string
                    );
                    break;
                default:
                    break;
            }
        }
    });
};

// (function(){ /* test coverage for JSCoverage */ })();
