/**
 * engine module
 */
define(['app/webgl',
        'app/render',
        'app/input'],
		function(webgl,render,input)
{

	"use strict";
	
	/*************************************************************************
	 * Engine class
	 *************************************************************************/
	
	/**
	 * Constructor
	 * @param canvas
	 */
	var Engine = function(canvas)
	{
		this.gl = webgl.Util.getContext(canvas);
	    webgl.Util.init(gl,canvas);
		
	    this.renderer = new render.Renderer(gl);    
	    
	    this.keyboard = new input.Keyboard();
	    
	    this.models = new Array();
	    
	    this.camera = null;
	    
	    this.light = null;
	};
	
	Engine.prototype.start = function()
	{
		webgl.Util.startRenderLoop(function()
		{
			
		});
	};
	
	return{
		Engine : Engine
	};
});