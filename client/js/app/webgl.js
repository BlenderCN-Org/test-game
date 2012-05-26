/**
 * WebGL module
 */
define(function()
{

	"use strict";
	
	/*************************************************************************
	 * Util class
	 *************************************************************************/
	
	/**
	 * Util object
	 */
	var Util = {};
	
	/**
	 * Retrieves a WebGL context
	 * @param canvas
	 * @returns
	 */
	Util.getContext = function (canvas)
	{
		var gl = null;

		try {
			gl = canvas.getContext("webgl") ||
				 canvas.getContext("experimental-webgl");
		} catch (e) {}

		if (!gl) {
			alert("Unable to initialize WebGL.");
		}

		return gl;
	};
	
	/**
	 * Creates a shader program
	 * @param gl
	 * @param vertexShader
	 * @param fragmentShader
	 * @param attribs
	 * @param uniforms
	 * @returns
	 */
	Util.createShaderProgram = function(gl, vertexShader, fragmentShader, attribs, uniforms)
	{
        var shaderProgram = gl.createProgram();

        var vs = this._compileShader(gl, vertexShader, gl.VERTEX_SHADER);
        var fs = this._compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);

        gl.attachShader(shaderProgram, vs);
        gl.attachShader(shaderProgram, fs);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            gl.deleteProgram(shaderProgram);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            return null;
        }
    
        // Query any shader attributes and uniforms that we specified needing
        if(attribs) {
            shaderProgram.attribute = {};
            for(var i in attribs) {
                var attrib = attribs[i];
                shaderProgram.attribute[attrib] = gl.getAttribLocation(shaderProgram, attrib);
            }
        }

        if(uniforms) {
            shaderProgram.uniform = {};
            for(var i in uniforms) {
                var uniform = uniforms[i];
                shaderProgram.uniform[uniform] = gl.getUniformLocation(shaderProgram, uniform);
            }
        }

        return shaderProgram;
    };

    /**
     * Compiles a shader
     * @param gl
     * @param source
     * @param type
     * @returns
     */
    Util._compileShader = function(gl, source, type)
    {
    	var shaderHeader = "#ifdef GL_ES\n";
        shaderHeader += "precision highp float;\n";
        shaderHeader += "#endif\n";
         
        var shader = gl.createShader(type);

        gl.shaderSource(shader, shaderHeader + source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.debug(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    },
	
	/**
	 * Initializes the WebGL attributes
	 * @param gl
	 * @param canvas
	 */
	Util.init = function (gl, canvas)
	{
		gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        Util._initRAF();
	};
	
	/**
	 * Initializes the requrest animation frame
	 */
	Util._initRAF = function ()
	{
		if(!window.requestAnimationFrame) {
	        window.requestAnimationFrame = (function(){
	            return  window.webkitRequestAnimationFrame || 
	                    window.mozRequestAnimationFrame    || 
	                    window.oRequestAnimationFrame      || 
	                    window.msRequestAnimationFrame     || 
	                    function(callback, element){
	                      window.setTimeout(function() {
	                          callback(new Date().getTime());
	                      }, 1000 / 60);
	                    };
	        })();
	    }
	};
	
	/**
	 * Creates a vertex buffer
	 * @param gl
	 * @param vertexArray
	 * @returns
	 */
	Util.createVertexBuffer = function(gl, vertexArray)
	{
		var vertexBuffer = gl.createBuffer();
		
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
        
        return vertexBuffer;
	};
	
	/**
	 * Creates an index buffer
	 * @param gl
	 * @param indexArray
	 * @returns
	 */
	Util.createIndexBuffer = function(gl, indexArray)
	{
		var indexBuffer = gl.createBuffer();
        
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);
        
        return indexBuffer;
	};
	
	/**
	 * Creates a solid texture with the specified color as RGB
	 * @param gl
	 * @param color
	 * @returns
	 */
	Util.createSolidTexture = function(gl, color)
	{
        var data = new Uint8Array(color);
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        return texture;
    };
	
	/**
	 * Loads a texture
	 * @param gl
	 * @param src
	 * @returns
	 */
	Util.loadTexture = function(gl, src)
	{
        var texture = gl.createTexture();
        
        var image = new Image();
        image.addEventListener("load", function() {
        	gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        });
        image.src = src;
        
        return texture;
    };
    
    /**
     * Rendering loop
     * @param callback
     */
    Util.startRenderLoop =  function(callback)
    {
    	function nextFrame(time){
            requestAnimationFrame(nextFrame);
            
            callback();
        };
        requestAnimationFrame(nextFrame);
    };

	return {
		Util : Util
	};
});