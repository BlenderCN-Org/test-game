/**
 * Input module
 */
define(function()
{

	"use strict";
	
	/*************************************************************************
	 * Keyboard class
	 *************************************************************************/
	
	/**
	 * Constructor
	 */
	var Keyboard = function()
	{
		var self = this;
		
		this.pressedKeys = new Array(128);
		
		window.addEventListener("keydown", function (event) {
            self.pressedKeys[event.keyCode] = true;
        }, false);

        window.addEventListener("keyup", function (event) {
            self.pressedKeys[event.keyCode] = false;
        }, false);
	};
	
	/**
	 * Process a key press
	 * @param key
	 * @param callback
	 */
	Keyboard.prototype.process = function(key,callback)
	{
		if(this.pressedKeys[key.charCodeAt(0)])
		{
			callback();
		}
	};
	
	/*************************************************************************
	 * Mouse class
	 *************************************************************************/
	
	/**
	 * Constructor
	 * @param canvas
	 * @param callback
	 */
	var Mouse = function(canvas, callback)
	{
		var self = this;
		
		this._moving = false;
		
		this._lastX = 0;
		this._lastY = 0;
		
		this._downListener(canvas);

        this._moveListener(canvas, callback);

        this._upListener(canvas);
	};
	
	/**
	 * Registers the mouse down listener
	 * @param canvas
	 */
	Mouse.prototype._downListener = function(canvas)
	{
		var self = this;
		canvas.addEventListener('mousedown', function(event)
		{
			if (event.which === 1)
			{
				this._moving = true;
			}
			self._lastX = event.pageX;
			self._lastY = event.pageY;
		}, false);
	};
	
	/**
	 * Registers the mouse up listener
	 * @param canvas
	 */
	Mouse.prototype._upListener = function(canvas)
	{
		canvas.addEventListener('mouseup', function()
		{
			this._moving = false;
		}, false);
	};
	
	/**
	 * Regosters the mouse move listener
	 * @param canvas
	 * @param callback
	 */
	Mouse.prototype._moveListener = function(canvas, callback)
	{
		var self = this;
		
		canvas.addEventListener('mousemove', function(event)
		{
			if (this._moving)
			{
				var xDelta = event.pageX - self._lastX,
					yDelta = event.pageY - self._lastY;

				self._lastX = event.pageX;
				self._lastY = event.pageY;

				callback(xDelta, yDelta);
			}
		}, false);
	};
	
	return{
		Keyboard : Keyboard,
		
		Mouse : Mouse
	};
});